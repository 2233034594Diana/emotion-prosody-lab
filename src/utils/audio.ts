export class MockAudioPlayer {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isPlaying = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
  }

  playMockEmotion(volume: number, durationMs: number, onEnd: () => void) {
    this.init();
    if (!this.ctx || !this.gainNode) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = 'sine';
    
    // Random frequency to simulate different emotions
    this.oscillator.frequency.value = 200 + Math.random() * 600; 

    // Add some FM modulation for "prosody" feel
    const lfo = this.ctx.createOscillator();
    lfo.type = 'triangle';
    lfo.frequency.value = 5 + Math.random() * 5;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(this.oscillator.frequency);
    lfo.start();

    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.1);
    
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    this.isPlaying = true;

    setTimeout(() => {
      if (this.gainNode && this.oscillator && this.ctx) {
        this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
        setTimeout(() => {
          this.oscillator?.stop();
          lfo.stop();
          this.isPlaying = false;
          onEnd();
        }, 100);
      }
    }, durationMs);
  }

  getVisualizerData(): Uint8Array | null {
    if (this.analyser && this.dataArray && this.isPlaying) {
      this.analyser.getByteTimeDomainData(this.dataArray);
      return this.dataArray;
    }
    return null;
  }
}

export const audioPlayer = new MockAudioPlayer();
