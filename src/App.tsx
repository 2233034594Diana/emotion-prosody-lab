import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ConsentLayers } from './components/Consent';
import { ConsentValidation } from './components/ConsentValidation';
import { Questionnaire } from './components/Questionnaire';
import { MavTask } from './components/MavTask';
import { Summary } from './components/Summary';
import { AppState, INITIAL_STATE, TrialData } from './types';
import { saveState, loadState, clearState } from './utils/storage';
import { QUESTIONS } from './constants';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    if (loaded && loaded.step !== 'closed') {
      setState(loaded);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveState(state);
    }
  }, [state, isLoaded]);

  const updateState = (updates: Partial<AppState>) => {
    setState(s => ({ ...s, ...updates }));
  };

  const handleRevoke = () => {
    if (window.confirm("¿Está seguro que desea revocar su consentimiento? Esto purgará todos los datos de la sesión actual de forma irrecuperable.")) {
      clearState();
      setState({ ...INITIAL_STATE, step: 'closed' });
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 'welcome':
        return (
          <div className="text-center space-y-8 bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Emotion Prosody & Cognitive Load Lab</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Plataforma de experimentación digital para la investigación en psicología cognitiva y neurociencia afectiva.
            </p>
            <button
              onClick={() => updateState({ 
                uuid: crypto.randomUUID(), 
                step: 'consent_l1' 
              })}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg"
            >
              Iniciar Proceso de Consentimiento
            </button>
          </div>
        );

      case 'consent_l1':
      case 'consent_l2':
      case 'consent_l3':
        return <ConsentLayers onComplete={() => updateState({ step: 'consent_validation' })} />;

      case 'consent_validation':
        return (
          <ConsentValidation 
            onSuccess={() => updateState({ step: 'phase1_intro', consentGiven: true })}
            onFail={() => {
              alert("Respuestas incorrectas. Por razones éticas (APA 8.02), no puede proceder.");
              handleRevoke();
            }}
          />
        );

      case 'phase1_intro':
        return (
          <div className="text-center space-y-6 bg-white p-10 rounded-2xl shadow-sm">
            <h2 className="text-3xl font-bold">Fase 1: Pruebas Psicométricas</h2>
            <p className="text-slate-600 max-w-xl mx-auto">A continuación, completará tres instrumentos breves (IRI, EEP, TAS-20). Por favor, responda con honestidad utilizando los controles deslizantes.</p>
            <button onClick={() => updateState({ step: 'phase1_iri' })} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 mt-4">Continuar</button>
          </div>
        );

      case 'phase1_iri':
        return <Questionnaire title="IRI (Empatía)" description="Índice de Reactividad Interpersonal" questions={QUESTIONS.iri} onComplete={(ans) => updateState({ iriAnswers: ans, step: 'phase1_eep' })} />;

      case 'phase1_eep':
        return <Questionnaire title="EEP (Estrés Percibido)" description="Escala de Estrés Percibido" questions={QUESTIONS.eep} onComplete={(ans) => updateState({ eepAnswers: ans, step: 'phase1_tas20' })} />;

      case 'phase1_tas20':
        return <Questionnaire title="TAS-20 (Alexitimia)" description="Escala de Alexitimia de Toronto" questions={QUESTIONS.tas20} onComplete={(ans) => updateState({ tas20Answers: ans, step: 'phase2_intro' })} />;

      case 'phase2_intro':
        return (
          <div className="text-center space-y-6 bg-white p-10 rounded-2xl shadow-sm">
            <h2 className="text-3xl font-bold">Fase 2: Reconocimiento Emocional</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Escuchará breves extractos de audio (Dataset MAV). Deberá identificar la emoción expresada y su nivel de intensidad. Ajuste el volumen a un nivel cómodo antes de iniciar.</p>
            <button onClick={() => updateState({ step: 'phase2_task' })} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 mt-4">Comenzar Tarea</button>
          </div>
        );

      case 'phase2_task':
        return <MavTask onComplete={(trials) => updateState({ mavTrials: trials, step: 'phase3_intro' })} />;

      case 'phase3_intro':
        return (
          <div className="text-center space-y-6 bg-white p-10 rounded-2xl shadow-sm">
            <h2 className="text-3xl font-bold">Fase 3: Carga Cognitiva</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Para finalizar, evaluaremos la carga cognitiva requerida durante la tarea auditiva anterior utilizando la escala NASA-TLX.</p>
            <button onClick={() => updateState({ step: 'phase3_nasatlx' })} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 mt-4">Evaluar</button>
          </div>
        );

      case 'phase3_nasatlx':
        return <Questionnaire title="NASA-TLX" description="Evaluación de carga de trabajo" questions={QUESTIONS.nasa} scaleLabels={['Baja', 'Alta']} scaleMax={100} onComplete={(ans) => updateState({ nasaTlxAnswers: ans, step: 'summary' })} />;

      case 'summary':
        return <Summary state={state} />;

      case 'closed':
        return (
          <div className="text-center space-y-6 py-12">
            <AlertTriangle className="w-16 h-16 text-slate-400 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-700">Sesión Finalizada / Datos Purgados</h2>
            <p className="text-slate-500">De acuerdo con los lineamientos éticos, los datos locales han sido eliminados.</p>
          </div>
        );
    }
  };

  if (!isLoaded) return null;

  return (
    <Layout state={state} onRevoke={handleRevoke}>
      {renderStep()}
    </Layout>
  );
}
