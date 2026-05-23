import { Howler } from 'howler';

function getCtx(): AudioContext | null {
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
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.3,
  pitchEnd?: number
): void {
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
}

function playNoise(duration: number, frequency: number, gain = 0.15): void {
  const ctx = getCtx();
  if (!ctx) return;

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = frequency;
  filter.Q.value = 1.5;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start();
  source.stop(ctx.currentTime + duration);
}

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
    playTone(330, 0.18, 'sine', 0.2, 220);
  },

  playRowsChange(): void {
    playNoise(0.06, 180, 0.2);
    playTone(200, 0.06, 'square', 0.08);
  },

  playClick(): void {
    playTone(880, 0.035, 'triangle', 0.09);
  },
};
