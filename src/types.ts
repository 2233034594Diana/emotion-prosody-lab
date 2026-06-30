export type Step =
  | 'welcome'
  | 'consent_l1'
  | 'consent_l2'
  | 'consent_l3'
  | 'consent_validation'
  | 'phase1_intro'
  | 'phase1_iri'
  | 'phase1_eep'
  | 'phase1_tas20'
  | 'phase2_intro'
  | 'phase2_task'
  | 'phase3_intro'
  | 'phase3_nasatlx'
  | 'summary'
  | 'closed';

export interface TrialData {
  emotion: string;
  selectedEmotion: string;
  intensity: number;
  reactionTime: number;
  correct: boolean;
}

export interface AppState {
  uuid: string;
  step: Step;
  consentGiven: boolean;
  iriAnswers: Record<string, number>;
  eepAnswers: Record<string, number>;
  tas20Answers: Record<string, number>;
  mavTrials: TrialData[];
  nasaTlxAnswers: Record<string, number>;
}

export const INITIAL_STATE: AppState = {
  uuid: '',
  step: 'welcome',
  consentGiven: false,
  iriAnswers: {},
  eepAnswers: {},
  tas20Answers: {},
  mavTrials: [],
  nasaTlxAnswers: {},
};
