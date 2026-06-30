import React from 'react';
import { Download, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AppState } from '../types';
import { exportToCSV } from '../utils/storage';

export function Summary({ state }: { state: AppState }) {
  const eepScore = Object.values(state.eepAnswers).reduce((a, b) => a + b, 0);
  const isHighStress = eepScore > 15;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-8">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">¡Gracias por su participación!</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          Su contribución es vital para nuestra investigación sobre el impacto del estrés urbano en el procesamiento de emociones.
        </p>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Resumen de Resultados</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500">ID Anónimo</p>
            <p className="font-mono font-medium text-slate-800 truncate">{state.uuid.split('-')[0]}...</p>
          </div>
          <div>
            <p className="text-slate-500">Precisión MAV</p>
            <p className="font-medium text-slate-800">
              {((state.mavTrials.filter(t => t.correct).length / state.mavTrials.length) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-500 mb-1">Predicción de Impacto por Estrés</p>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isHighStress ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-indigo-50 text-indigo-800 border border-indigo-200'}`}>
              {isHighStress ? <AlertTriangle className="w-5 h-5"/> : <ShieldCheck className="w-5 h-5" />}
              <span className="font-medium">{isHighStress ? 'Alto Riesgo de Hipervigilancia' : 'Niveles Normales'}</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Basado en su puntuación de EEP. Nota: Esto no constituye un diagnóstico clínico.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => exportToCSV(state)}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Descargar Datos (CSV)
        </button>
      </div>
    </div>
  );
}
