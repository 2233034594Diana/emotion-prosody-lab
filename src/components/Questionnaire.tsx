import React, { useState } from 'react';
import { motion } from 'motion/react';

interface Question {
  id: string;
  text: string;
}

interface QuestionnaireProps {
  title: string;
  description: string;
  questions: Question[];
  onComplete: (answers: Record<string, number>) => void;
  scaleLabels?: [string, string];
  scaleMax?: number;
}

export function Questionnaire({ 
  title, 
  description, 
  questions, 
  onComplete,
  scaleLabels = ['Totalmente en desacuerdo', 'Totalmente de acuerdo'],
  scaleMax = 5
}: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const q = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleSlider = (val: number) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }));
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      onComplete(answers);
    }
  };

  const hasAnswer = answers[q.id] !== undefined;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 mt-2">{description}</p>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="bg-indigo-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <motion.div 
        key={q.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-h-[200px] flex flex-col justify-center"
      >
        <h3 className="text-xl font-medium text-slate-800 text-center mb-10 leading-relaxed">
          {q.text}
        </h3>

        <div className="px-4">
          <input 
            type="range" 
            min="1" 
            max={scaleMax} 
            value={answers[q.id] || Math.ceil(scaleMax / 2)}
            onChange={(e) => handleSlider(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs font-medium text-slate-400 mt-4 uppercase tracking-wider">
            <span>{scaleLabels[0]}</span>
            <span>{scaleLabels[1]}</span>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 flex justify-end">
        <button
          disabled={!hasAnswer}
          onClick={next}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {currentIndex === questions.length - 1 ? 'Finalizar Sección' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
}
