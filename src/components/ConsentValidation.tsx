import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const QUESTIONS = [
  {
    q: "¿Qué sucede si decide retirarse a la mitad del estudio?",
    opts: ["Se guarda la información hasta ese momento", "No puedo retirarme", "Mis datos se eliminan inmediatamente sin penalización"],
    ans: 2
  },
  {
    q: "¿Esta aplicación realizará un diagnóstico clínico sobre su salud mental?",
    opts: ["Sí, mediante IA", "No, solo recopila datos para investigación", "Sí, pero es confidencial"],
    ans: 1
  },
  {
    q: "¿Cómo se protege su identidad en este estudio?",
    opts: ["Con mi nombre completo", "Usando un identificador único anónimo (UUID)", "No se protege"],
    ans: 1
  }
];

export function ConsentValidation({ onSuccess, onFail }: { onSuccess: () => void, onFail: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    const isAllCorrect = QUESTIONS.every((q, i) => answers[i] === q.ans);
    if (isAllCorrect && agreed) {
      onSuccess();
    } else {
      onFail();
    }
  };

  const isComplete = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Validación de Comprensión Ética</h2>
      <p className="text-slate-600">Para garantizar que ha comprendido sus derechos (APA 8.02), por favor responda:</p>
      
      <div className="space-y-6">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="space-y-3">
            <p className="font-medium text-slate-800">{i + 1}. {q.q}</p>
            <div className="space-y-2">
              {q.opts.map((opt, j) => (
                <label key={j} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name={`q_${i}`}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    onChange={() => setAnswers(prev => ({ ...prev, [i]: j }))}
                  />
                  <span className="text-slate-700 text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 mt-6 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span className="font-medium text-slate-800">Entiendo mis derechos y otorgo mi consentimiento informado.</span>
        </label>
      </div>

      <button
        disabled={!isComplete || !agreed}
        onClick={handleSubmit}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Comenzar Estudio
      </button>
    </div>
  );
}
