import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { audioPlayer } from '../utils/audio';
import { MAV_EMOTIONS } from '../constants';
import { TrialData } from '../types';

export function MavTask({ onComplete }: { onComplete: (trials: TrialData[]) => void }) {
  const [trials, setTrials] = useState<TrialData[]>([]);
  const [trialCount, setTrialCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [canRespond, setCanRespond] = useState(false);
  const [intensity, setIntensity] = useState(50);
  
  const startTimeRef = useRef<number>(0);
  const currentEmotion = useRef<string>('');

  const MAX_TRIALS = 3; // Demo limit

  const playStimulus = () => {
    setIsPlaying(true);
    setCanRespond(false);
    
    // Pick random emotion
    currentEmotion.current = MAV_EMOTIONS[Math.floor(Math.random() * MAV_EMOTIONS.length)];
    
    audioPlayer.playMockEmotion(volume, 2000, () => {
      setIsPlaying(false);
      setCanRespond(true);
      startTimeRef.current = Date.now();
    });
  };

  const handleResponse = (selectedEmotion: string) => {
    const reactionTime = Date.now() - startTimeRef.current;
    
    const newTrial: TrialData = {
      emotion: currentEmotion.current,
      selectedEmotion,
      intensity,
      reactionTime,
      correct: currentEmotion.current === selectedEmotion // Mock correctness
    };

    setTrials(prev => [...prev, newTrial]);
    setTrialCount(c => c + 1);
    setCanRespond(false);
    setIntensity(50);
  };

  useEffect(() => {
    if (trialCount >= MAX_TRIALS) {
      onComplete(trials);
    }
  }, [trialCount, MAX_TRIALS, trials, onComplete]);

  if (trialCount >= MAX_TRIALS) return null;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">Reconocimiento Emocional (Ensayo {trialCount + 1}/{MAX_TRIALS})</h2>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          <Volume2 className="w-4 h-4 text-slate-500" />
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-indigo-600"
          />
        </div>
      </div>

      <AudioVisualizer isPlaying={isPlaying} />

      <div className="my-8 flex justify-center">
        {!isPlaying && !canRespond && (
          <button
            onClick={playStimulus}
            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all"
          >
            Reproducir Estímulo Audio
          </button>
        )}
      </div>

      {canRespond && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <p className="text-center font-medium text-slate-700 mb-4">Ajuste la intensidad percibida:</p>
            <input 
              type="range" 
              min="0" max="100" 
              value={intensity}
              onChange={e => setIntensity(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2 uppercase">
              <span>Baja</span>
              <span>Alta</span>
            </div>
          </div>

          <div>
            <p className="text-center font-medium text-slate-700 mb-4">¿Qué emoción identifica?</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MAV_EMOTIONS.map(emo => (
                <button
                  key={emo}
                  onClick={() => handleResponse(emo)}
                  className="py-4 bg-white border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
