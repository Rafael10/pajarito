import { useRef, useCallback } from 'react';

const MELODY   = [330, 294, 262, 294, 330, 330, 330, 294, 294, 294, 330, 392, 392];
const NOTE_DUR = 0.18;

const useSound = () => {
  const ctxRef     = useRef(null);
  const bgGainRef  = useRef(null);   // nodo maestro de volumen para la música
  const bgGenRef   = useRef(0);      // generación actual: evita loops huérfanos
  const bgTimerRef = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current)
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  };

  // Nodo maestro al que se conectan todas las notas de fondo
  const getBgGain = () => {
    const ac = getCtx();
    if (!bgGainRef.current) {
      bgGainRef.current = ac.createGain();
      bgGainRef.current.connect(ac.destination);
    }
    return bgGainRef.current;
  };

  const tone = (freq, dur, type = 'square', vol = 0.25, delay = 0) => {
    const ac   = getCtx();
    const osc  = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type            = type;
    osc.frequency.value = freq;
    const t = ac.currentTime + delay;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  };

  const playJump = useCallback(() => {
    tone(300, 0.08, 'square', 0.2, 0);
    tone(500, 0.06, 'square', 0.15, 0.06);
  }, []);

  const playScore = useCallback(() => {
    [523, 659, 784].forEach((f, i) => tone(f, 0.12, 'sine', 0.2, i * 0.1));
  }, []);

  const playGameOver = useCallback(() => {
    tone(440, 0.15, 'sawtooth', 0.3, 0);
    tone(330, 0.15, 'sawtooth', 0.3, 0.18);
    tone(165, 0.5,  'sawtooth', 0.3, 0.36);
  }, []);

  const scheduleMelody = useCallback((gen) => {
    if (gen !== bgGenRef.current) return; // generación obsoleta, no continuar

    const ac     = getCtx();
    const bgGain = getBgGain();
    const start  = ac.currentTime + 0.05;

    MELODY.forEach((freq, i) => {
      const osc  = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(bgGain); // → nodo maestro, no directo a destination
      osc.type            = 'square';
      osc.frequency.value = freq;
      const t = start + i * NOTE_DUR;
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + NOTE_DUR * 0.8);
      osc.start(t);
      osc.stop(t + NOTE_DUR * 0.8 + 0.01);
    });

    bgTimerRef.current = setTimeout(
      () => scheduleMelody(gen),
      MELODY.length * NOTE_DUR * 1000 - 50
    );
  }, []);

  const startBgMusic = useCallback(() => {
    const ac     = getCtx();
    const bgGain = getBgGain();
    bgGenRef.current += 1;                          // nueva generación
    bgGain.gain.setValueAtTime(1, ac.currentTime);  // activar volumen maestro
    scheduleMelody(bgGenRef.current);
  }, [scheduleMelody]);

  const stopBgMusic = useCallback(() => {
    bgGenRef.current += 1;               // invalida loops anteriores
    clearTimeout(bgTimerRef.current);
    bgTimerRef.current = null;
    if (bgGainRef.current) {
      const ac = getCtx();
      bgGainRef.current.gain.setValueAtTime(0, ac.currentTime); // silencio inmediato
    }
  }, []);

  return { playJump, playScore, playGameOver, startBgMusic, stopBgMusic };
};

export default useSound;