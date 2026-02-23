import { useState, useRef, useEffect, useCallback, memo } from 'react';

// ── Audio ──────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

function getAudioContext(): AudioContext | null {
  if (!audioCtx) {
    try {
      const Ctor = window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctor();
    } catch { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  if (audioCtx.state === 'closed') {
    try {
      const Ctor = window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctor();
    } catch { return null; }
  }
  return audioCtx;
}

/** Pre-generated 500ms noise buffer — reused across all keystrokes. */
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    const size = Math.floor(ctx.sampleRate * 0.5);
    noiseBuffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

/** Unlock the AudioContext on first user gesture. */
export function initAudioContext(): void {
  getAudioContext();
}

function playKeySound(): void {
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;
  try {
    const now = ctx.currentTime;

    // Noise "click" — bandpass-filtered white noise burst
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);
    const offset = Math.random() * 0.45; // random position for variation

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1800 + Math.random() * 800; // 1.8–2.6 kHz
    bandpass.Q.value = 0.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.13, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now, offset, 0.04);

    // Low "thock" tone — triangle wave with pitch drop
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110 + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.04);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.07, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch { /* ignore audio errors */ }
}

// ── StreamingMessage ───────────────────────────────────────────────
interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
}

export const StreamingMessage = memo(function StreamingMessage({
  content,
  isStreaming,
}: StreamingMessageProps) {
  const [displayLen, setDisplayLen] = useState(0);
  const displayLenRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  // Stable tick — all state accessed via refs, never recreated
  const tick = useCallback(() => {
    timerRef.current = null;
    const cur = displayLenRef.current;
    const target = contentRef.current;
    if (cur >= target.length) return;

    const ch = target[cur];
    if (ch && ch !== ' ' && ch !== '\n') playKeySound();

    displayLenRef.current = cur + 1;
    setDisplayLen(cur + 1);

    // Adaptive speed: catch up fast when the buffer has grown large
    const lag = target.length - (cur + 1);
    const delay = lag > 80 ? 6 + Math.random() * 8 : 38 + Math.random() * 28;
    timerRef.current = setTimeout(tick, delay);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Only run when content changes — NOT on every displayLen update.
  // This prevents the timer from being cancelled on each character.
  useEffect(() => {
    if (content.length === 0) {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      displayLenRef.current = 0;
      setDisplayLen(0);
      return;
    }
    if (content.length > displayLenRef.current && !timerRef.current) {
      tick();
    }
  }, [content, tick]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const visible = content.slice(0, displayLen);
  const showCursor = isStreaming || displayLen < content.length;

  return (
    <span className="whitespace-pre-wrap break-words">
      {visible}
      {showCursor && (
        <span className="inline-block w-[2px] h-[1em] bg-green-400/80 ml-[1px] align-text-bottom animate-pulse" />
      )}
    </span>
  );
});
