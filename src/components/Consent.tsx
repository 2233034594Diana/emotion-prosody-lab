import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Info, FileText, CheckCircle2 } from 'lucide-react';

export function ConsentLayers({ onComplete }: { onComplete: () => void }) {
  const [layer, setLayer] = useState<1 | 2 | 3>(1);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((l) => (
          <button
            key={l}
            onClick={() => setLayer(l as any)}
            className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${
              layer === l 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            Capa {l}
          </button>
        ))}
      </div>

      <div className="min-h-[250px]">
        {layer === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Info className="text-indigo-500"/> Resumen Ejecutivo</h2>
            <p className="text-slate-600 leading-relaxed">
              Bienvenido al estudio <strong>Emotion Prosody & Cognitive Load Lab</strong>. El objetivo de esta investigación es comprender cómo el estrés ambiental afecta la percepción de las emociones a través de la voz (prosodia). 
              Su participación consistirá en completar cuestionarios, escuchar audios y evaluar emociones.
            </p>
          </motion.div>
        )}
        
        {layer === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Shield className="text-indigo-500"/> Beneficios, Riesgos y Contacto</h2>
            <div className="space-y-3 text-slate-600 leading-relaxed">
              <p><strong>Beneficios:</strong> Ayudará a avanzar la ciencia sobre la cognición y el estrés urbano. Al finalizar, recibirá un resumen de su perfil empático.</p>
              <p><strong>Riesgos:</strong> Mínimos. Puede sentir fatiga cognitiva o estrés leve al escuchar algunos audios.</p>
              <p><strong>Privacidad:</strong> Sus datos serán anonimizados (UUID) y almacenados de forma cifrada.</p>
              <p><strong>Contacto:</strong> lab@emotionprosody.org</p>
            </div>
          </motion.div>
        )}

        {layer === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="text-indigo-500"/> Documento Integral (LFPDPPP y APA 8.02)</h2>
            <div className="h-48 overflow-y-auto pr-4 text-sm text-slate-600 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p>De conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y los principios éticos de la APA 8.02:</p>
              <p>1. Su participación es completamente voluntaria.</p>
              <p>2. Tiene derecho a declinar o retirarse del estudio en cualquier momento mediante el botón 'Revocar Consentimiento', sin penalización alguna.</p>
              <p>3. El sistema no recopila audios ni imágenes del participante, únicamente registros conductuales de respuesta a estímulos WAV del dataset Montreal Affective Voices.</p>
              <p>4. No se emiten diagnósticos clínicos.</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          Proceder a Validación <CheckCircle2 className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
}
