import { useState, useEffect, useRef, useCallback } from 'react';

interface TypewriterOptions {
  text: string;
  speed?: number; // ms per character (lower = faster)
  enabled?: boolean;
}

// Mechanical keyboard sound frequencies for realism
const KEY_SOUNDS = [
  800, 850, 900,  // Base frequencies for variety
  750, 820, 880,
  780, 840, 860
];

export function useTypewriter({ text, speed = 15, enabled = true }: TypewriterOptions) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Play mechanical key sound
  const playKeySound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Random frequency for variety
    const freq = KEY_SOUNDS[Math.floor(Math.random() * KEY_SOUNDS.length)];
    oscillator.frequency.value = freq;
    oscillator.type = 'square';
    
    // Very short, sharp sound
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    // Reset when text changes
    setDisplayText('');
    setIsComplete(false);
    indexRef.current = 0;
    setIsTyping(true);

    const typeNextChar = () => {
      if (indexRef.current < text.length) {
        const nextChar = text[indexRef.current];
        setDisplayText(prev => prev + nextChar);
        
        // Play sound for printable characters
        if (nextChar !== ' ' && nextChar !== '\n') {
          playKeySound();
        }
        
        indexRef.current++;
        
        // Variable speed for realism (faster for common letters)
        const variableSpeed = speed + (Math.random() * 10 - 5);
        timeoutRef.current = setTimeout(typeNextChar, variableSpeed);
      } else {
        setIsTyping(false);
        setIsComplete(true);
      }
    };

    // Small delay before starting
    timeoutRef.current = setTimeout(typeNextChar, 100);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, enabled, playKeySound]);

  return {
    displayText,
    isTyping,
    isComplete,
    initAudio // Call this on user interaction to enable audio
  };
}
