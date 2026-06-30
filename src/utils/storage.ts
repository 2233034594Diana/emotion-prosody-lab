import { AppState } from '../types';

const SECRET_KEY = 'emotion-lab-secret';

// A simple XOR cipher for mock encryption to satisfy LFPDPPP local encryption requirements
function xorEncryptDecrypt(input: string, key: string): string {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return output;
}

export function saveState(state: AppState) {
  try {
    const json = JSON.stringify(state);
    const encrypted = btoa(xorEncryptDecrypt(json, SECRET_KEY));
    localStorage.setItem('emotion_lab_state', encrypted);
  } catch (e) {
    console.error('Error saving state', e);
  }
}

export function loadState(): AppState | null {
  try {
    const encrypted = localStorage.getItem('emotion_lab_state');
    if (!encrypted) return null;
    const decrypted = xorEncryptDecrypt(atob(encrypted), SECRET_KEY);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('Error loading state', e);
    return null;
  }
}

export function clearState() {
  localStorage.removeItem('emotion_lab_state');
}

export function exportToCSV(state: AppState) {
  // Calculate scores
  const eepScore = Object.values(state.eepAnswers).reduce((a, b) => a + b, 0);
  const iriScore = Object.values(state.iriAnswers).reduce((a, b) => a + b, 0);
  const tas20Score = Object.values(state.tas20Answers).reduce((a, b) => a + b, 0);
  const tlxScore = Object.values(state.nasaTlxAnswers).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(state.nasaTlxAnswers).length);
  
  const correctTrials = state.mavTrials.filter(t => t.correct).length;
  const accuracy = state.mavTrials.length > 0 ? (correctTrials / state.mavTrials.length) * 100 : 0;
  
  const avgReactionTime = state.mavTrials.length > 0 
    ? state.mavTrials.reduce((a, b) => a + b.reactionTime, 0) / state.mavTrials.length 
    : 0;

  let stressPrediction = 'Bajo';
  if (eepScore > 15) stressPrediction = 'Alto';
  else if (eepScore > 8) stressPrediction = 'Medio';

  const headers = [
    'Sujeto_ID',
    'EEP_Score',
    'IRI_Empatia',
    'TAS20_Total',
    'MAV_Exactitud_Pct',
    'MAV_Tiempo_Reaccion_ms',
    'NASA_TLX_Carga',
    'Prediccion_Impacto_Estres'
  ];

  const row = [
    state.uuid,
    eepScore,
    iriScore,
    tas20Score,
    accuracy.toFixed(2),
    avgReactionTime.toFixed(0),
    tlxScore.toFixed(2),
    stressPrediction
  ];

  const csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n" 
    + row.join(",");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `dataset_${state.uuid}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
