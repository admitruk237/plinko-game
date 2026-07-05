import { Howler } from 'howler';

const getCtx = (): AudioContext | null => {
  try {
    Howler.volume(1);
    const ctx = Howler.ctx as AudioContext | null;
    if (ctx?.state === 'suspended') {
      void ctx.resume();
    }
    return ctx;
  } catch {
    return null;
  }
};

const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.3,
  pitchEnd?: number
): void => {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  if (pitchEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(pitchEnd, ctx.currentTime + duration);
  }

  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
};

export const SoundEngine = {
  playDrop(): void {
    playTone(900, 0.07, 'square', 0.25, 600);
  },

  playPegHit(): void {
    const pitch = 300 + Math.random() * 200;
    playTone(pitch, 0.04, 'triangle', 0.12);
  },

  playWin(): void {
    playTone(523, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 100);
  },

  playBigWin(): void {
    playTone(523, 0.12, 'sine', 0.3);
    setTimeout(() => playTone(659, 0.12, 'sine', 0.3), 110);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.35), 220);
  },

  playLoss(): void {
    playTone(392, 0.28, 'sawtooth', 0.16, 370);
    setTimeout(() => playTone(349, 0.28, 'sawtooth', 0.16, 330), 240);
    setTimeout(() => playTone(311, 0.28, 'sawtooth', 0.16, 294), 480);
    setTimeout(() => playTone(233, 0.7, 'sawtooth', 0.18, 174), 720);
  },

  playRowsChange(): void {
    const pitch = 520 + Math.random() * 80;
    playTone(pitch, 0.03, 'triangle', 0.11);
  },

  playClick(): void {
    playTone(880, 0.035, 'triangle', 0.09);
  },
};
