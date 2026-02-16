import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Send, Square, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat, SUGGESTED_PROMPTS } from '@/features/chat';
import type { ChatMessage } from '@/features/chat';
import { PatternDivider } from '~components/SharedLayout';

// ── Mechanical Keyboard Sound Effect ────────────────────────────
const KEY_FREQUENCIES = [750, 800, 850, 900, 820, 780, 860, 880];

function playMechanicalKeySound(audioContext: AudioContext | null) {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  const freq = KEY_FREQUENCIES[Math.floor(Math.random() * KEY_FREQUENCIES.length)];
  oscillator.frequency.value = freq;
  oscillator.type = 'square';
  
  gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.04);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.04);
}

// ── Blinking Cursor Component ───────────────────────────────────
function BlinkingCursor({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span className="inline-block w-[2px] h-[14px] bg-blue-500 ml-[2px] animate-blink align-middle" />
  );
}

// ── Typing Message Component ────────────────────────────────────
const TypingMessage = memo(function TypingMessage({ 
  content, 
  isTyping,
  audioContext 
}: { 
  content: string; 
  isTyping: boolean;
  audioContext: AudioContext | null;
}) {
  const [displayText, setDisplayText] = useState('');
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!isTyping) {
      setDisplayText(content);
      return;
    }

    // Reset when content changes
    if (content.length < displayText.length) {
      setDisplayText('');
      indexRef.current = 0;
    }

    const typeNextChar = () => {
      if (indexRef.current < content.length) {
        const char = content[indexRef.current];
        setDisplayText(prev => prev + char);
        
        // Play sound for printable characters
        if (char !== ' ' && char !== '\n' && char !== '\t') {
          playMechanicalKeySound(audioContext);
        }
        
        indexRef.current++;
        
        // Variable speed for realism (12-20ms)
        const speed = 12 + Math.random() * 8;
        timeoutRef.current = setTimeout(typeNextChar, speed);
      }
    };

    typeNextChar();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [content, isTyping, audioContext]);

  return (
    <span className="whitespace-pre-wrap break-words">
      {displayText}
      {isTyping && <BlinkingCursor visible={true} />}
    </span>
  );
});

// ── Chat Message Row ────────────────────────────────────────────
const ChatMessageRow = memo(function ChatMessageRow({ 
  message, 
  isLatest,
  audioContext 
}: { 
  message: ChatMessage; 
  isLatest: boolean;
  audioContext: AudioContext | null;
}) {
  const isUser = message.role === 'user';
  const isStreaming = message.isStreaming && isLatest;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="text-[9px] font-mono text-zinc-600 mb-1 flex items-center gap-1">
          {isUser ? '// you' : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
              {'// nishant'}
            </>
          )}
        </div>
        <div
          className={`px-3 py-2.5 rounded-sm text-[12px] font-mono leading-relaxed transition-all duration-200 ${
            isUser
              ? 'bg-zinc-800/60 text-zinc-200 border border-zinc-700/30'
              : 'text-zinc-300 border-l-2 border-zinc-600 pl-3 bg-zinc-900/20'
          }`}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap break-words">{message.content}</span>
          ) : (
            <TypingMessage 
              content={message.content} 
              isTyping={!!isStreaming}
              audioContext={audioContext}
            />
          )}
        </div>
      </div>
    </div>
  );
});

// ── Chat Page ───────────────────────────────────────────────────
function ChatPage() {
  const { messages, isLoading, error, sendMessage, stopStreaming, clearChat } = useChat();
  const [input, setInput] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const showSuggestions = messages.length === 1 && messages[0].id === 'welcome';

  // Initialize audio context on first interaction
  const enableAudio = useCallback(() => {
    if (audioEnabled) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      setAudioEnabled(true);
    } catch {
      // Audio not supported
    }
  }, [audioEnabled]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    enableAudio();
    sendMessage(input);
    setInput('');
  }, [input, isLoading, sendMessage, enableAudio]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleSuggestion = useCallback((text: string) => {
    enableAudio();
    sendMessage(text);
  }, [sendMessage, enableAudio]);

  const handleClear = useCallback(() => {
    enableAudio();
    clearChat();
  }, [clearChat, enableAudio]);

  return (
    <div 
      className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in duration-500"
      onClick={enableAudio}
    >
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-doto text-2xl md:text-3xl text-zinc-100 tracking-tight uppercase">
            Chat://Nishant
          </h1>
          <p className="text-[11px] font-mono text-zinc-600 mt-1">
            // ask me anything — powered by AI, trained on my actual info
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Audio indicator */}
          <div 
            className={`text-[9px] font-mono px-2 py-1 rounded border transition-colors ${
              audioEnabled 
                ? 'border-green-800 text-green-600 bg-green-900/20' 
                : 'border-zinc-800 text-zinc-700'
            }`}
            title={audioEnabled ? 'Sound enabled' : 'Click to enable sound'}
          >
            {audioEnabled ? '♪ ON' : '♪ OFF'}
          </div>
          
          <button
            onClick={handleClear}
            className="group relative p-2 text-zinc-600 hover:text-zinc-300 transition-colors border border-dashed border-zinc-800 rounded-sm hover:border-zinc-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            aria-label="Clear chat"
            title="Clear conversation"
          >
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-transparent group-hover:border-zinc-700 transition-colors" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-transparent group-hover:border-zinc-700 transition-colors" />
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="group relative p-2 text-zinc-600 hover:text-zinc-300 transition-colors border border-dashed border-zinc-800 rounded-sm hover:border-zinc-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            aria-label="Go back"
            title="Back"
          >
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-transparent group-hover:border-zinc-700 transition-colors" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-transparent group-hover:border-zinc-700 transition-colors" />
            <ArrowLeft size={14} />
          </button>
        </div>
      </div>

      {/* Pattern Divider */}
      <PatternDivider />

      {/* Online status */}
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
        <span className="text-[10px] font-mono text-zinc-600">online now</span>
        {isLoading && (
          <>
            <span className="text-zinc-700">·</span>
            <span className="text-[10px] font-mono text-blue-500/70 animate-pulse">typing...</span>
          </>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-2 min-h-0 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <ChatMessageRow 
            key={msg.id} 
            message={msg} 
            isLatest={index === messages.length - 1}
            audioContext={audioContextRef.current}
          />
        ))}

        {/* Suggested Prompts */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 mt-4 animate-in slide-in-from-bottom-2 duration-300">
            {SUGGESTED_PROMPTS.map((s: string) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="text-[10px] font-mono text-zinc-500 px-3 py-2 border border-dashed border-zinc-800 rounded-sm hover:border-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/40 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="text-[10px] font-mono text-red-400/70 text-center py-3 px-4 bg-red-950/20 border border-red-900/30 rounded-sm" role="alert" aria-live="polite">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-dashed border-zinc-800 mt-4 shrink-0">
        <div className="group relative flex items-center gap-3 px-4 py-3 border border-dashed border-zinc-800 rounded-sm bg-black/20 hover:border-zinc-700 transition-colors">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-transparent group-hover:border-zinc-600 transition-colors" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-transparent group-hover:border-zinc-600 transition-colors" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-transparent group-hover:border-zinc-600 transition-colors" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-transparent group-hover:border-zinc-600 transition-colors" />

          <span className="text-zinc-600 font-mono text-[11px] select-none">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.slice(0, 500))}
            onKeyDown={handleKeyDown}
            onFocus={enableAudio}
            placeholder={isLoading ? "Nishant is typing..." : "Type your message..."}
            className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-600 text-[12px] font-mono focus-visible:outline-none disabled:opacity-50"
            disabled={isLoading}
            maxLength={500}
            aria-label="Chat message input"
            autoComplete="off"
            spellCheck={false}
          />
          {isLoading ? (
            <button
              onClick={stopStreaming}
              className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-sm"
              aria-label="Stop generating"
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-1.5 text-zinc-600 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-sm"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          )}
        </div>
        <div className="flex justify-between px-1 mt-1.5">
          <span className="text-[9px] font-mono text-zinc-700">
            {input.length}/500 chars
          </span>
          <span className="text-[9px] font-mono text-zinc-700">
            gemini-2.5-flash · session resets on refresh
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
