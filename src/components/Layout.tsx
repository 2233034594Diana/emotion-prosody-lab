import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { AppState } from '../types';

interface LayoutProps {
  children: ReactNode;
  state: AppState;
  onRevoke: () => void;
}

export function Layout({ children, state, onRevoke }: LayoutProps) {
  const showRevoke = state.step !== 'welcome' && state.step !== 'closed' && state.consentGiven;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 font-medium tracking-tight">
            <ShieldAlert className="w-5 h-5" />
            <span>Emotion Prosody Lab</span>
          </div>
          {showRevoke && (
            <button
              onClick={onRevoke}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
              title="Revocar Consentimiento y Borrar Datos"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Revocar Consentimiento</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
