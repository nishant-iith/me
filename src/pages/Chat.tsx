import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Send, Square, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat, SUGGESTED_PROMPTS } from '@/features/chat';
import type { ChatMessage } from '@/features/chat';
import { PatternDivider } from '~components/SharedLayout';

// ── Audio Context ─────────────────────────────────────────────────
let audioContextRef: AudioContext | null = null;
let audioInitialized = false;

// ── Mechanical Keyboard Sound ────────────────────────────────────
function initAudio() {
  if (audioInitialized) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContextRef = new AudioContextClass();
    if (audioContextRef.state === 'suspended') {
      audioContextRef.resume();
    }
    audioInitialized = true;
  } catch {
    // Audio not supported
  }
}

function playKeySound() {
  if (!audioContextRef) return;
  
  const frequencies = [500, 550, 600, 650, 700, 750];
  const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
  
  const oscillator = audioContextRef.createOscillator();
  const gainNode = audioContextRef.createGain();
  
  oscillator.frequency.value = freq;
  oscillator.type = 'square';
  
  gainNode.gain.setValueAtTime(0.1, audioContextRef.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.currentTime + 0.06);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContextRef.destination);
  
  oscillator.start(audioContextRef.currentTime);
  oscillator.stop(audioContextRef.currentTime + 0.06);
}

// ── Cursor Component ───────────────────────────────────────────
const Cursor = () => (
  <span className="inline-block w-[2px] h-4 bg-blue-500 ml-[2px] align-middle animate-pulse" />
);

// ── Streaming Message Display ─────────────────────────────────────
const StreamingMessage = memo(function StreamingMessage({ 
  content, 
  isStreaming 
}: { 
  content: string; 
  isStreaming: boolean;
}) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const prevContentRef = useRef(content);

  useEffect(() => {
    // If content grew (new chunk arrived), continue typing from where we left off
    if (content.length > prevContentRef.current.length) {
      // New content arrived - continue typing from current position
      const startTyping = () => {
        if (displayIndex < content.length) {
          const char = content[displayIndex];
          
          // Play sound for non-whitespace
          if (char && char !== ' ' && char !== '\n') {
            playKeySound();
          }
          
          setDisplayIndex(prev => prev + 1);
          
          // Typing speed: 40-80ms per character
          const delay = 40 + Math.random() * 40;
          timeoutRef.current = setTimeout(startTyping, delay);
        }
      };
      
      startTyping();
    } else if (content.length > 0 && displayIndex === 0) {
      // Fresh content - start typing from beginning
      setDisplayIndex(1);
      if (content[0] && content[0] !== ' ' && content[0] !== '\n') {
        playKeySound();
      }
    }
    
    prevContentRef.current = content;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [content, displayIndex]);

  // Reset when content is cleared
  useEffect(() => {
    if (content.length === 0) {
      setDisplayIndex(0);
      prevContentRef.current = '';
    }
  }, [content]);

  const visibleContent = content.slice(0, displayIndex);

  return (
    <span className="whitespace-pre-wrap break-words">
      {visibleContent}
      {isStreaming && displayIndex <= content.length && <Cursor />}
    </span>
  );
});

// ── Chat Message Row ────────────────────────────────────────────
const ChatMessageRow = memo(function ChatMessageRow({ 
  message, 
  isLatest 
}: { 
  message: ChatMessage; 
  isLatest: boolean;
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
          className={`px-3 py-2.5 rounded-sm text-[12px] font-mono leading-relaxed ${
            isUser
              ? 'bg-zinc-800/60 text-zinc-200 border border-zinc-700/30'
              : 'text-zinc-300 border-l-2 border-zinc-600 pl-3 bg-zinc-900/20'
          }`}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap break-words">{message.content}</span>
          ) : (
            <StreamingMessage 
              content={message.content} 
              isStreaming={!!isStreaming}
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const showSuggestions = messages.length === 1 && messages[0].id === 'welcome';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    initAudio();
    sendMessage(input);
    setInput('');
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleSuggestion = useCallback((text: string) => {
    initAudio();
    sendMessage(text);
  }, [sendMessage]);

  return (
    <div 
      className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in duration-500"
      onClick={initAudio}
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
          <button
            onClick={clearChat}
            className="group relative p-2 text-zinc-600 hover:text-zinc-300 transition-colors border border-dashed border-zinc-800 rounded-sm hover:border-zinc-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            aria-label="Clear chat"
          >
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-transparent group-hover:border-zinc-700 transition-colors" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-transparent group-hover:border-zinc-700 transition-colors" />
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="group relative p-2 text-zinc-600 hover:text-zinc-300 transition-colors border border-dashed border-zinc-800 rounded-sm hover:border-zinc-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            aria-label="Go back"
          >
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-transparent group-hover:border-zinc-700 transition-colors" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-transparent group-hover:border-zinc-700 transition-colors" />
            <ArrowLeft size={14} />
          </button>
        </div>
      </div>

      <PatternDivider />

      {/* Status */}
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-600">online now</span>
        {isLoading && (
          <>
            <span className="text-zinc-700">·</span>
            <span className="text-[10px] font-mono text-blue-400 animate-pulse">typing...</span>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-2 min-h-0 scrollbar-thin">
        {messages.map((msg, index) => (
          <ChatMessageRow 
            key={msg.id} 
            message={msg} 
            isLatest={index === messages.length - 1}
          />
        ))}

        {showSuggestions && (
          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTED_PROMPTS.map((s: string) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="text-[10px] font-mono text-zinc-500 px-3 py-2 border border-dashed border-zinc-800 rounded-sm hover:border-zinc-600 hover:text-zinc-300 transition-all cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="text-[10px] font-mono text-red-400/70 text-center py-3 px-4 bg-red-950/20 border border-red-900/30 rounded-sm">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-dashed border-zinc-800 mt-4 shrink-0">
        <div className="group relative flex items-center gap-3 px-4 py-3 border border-dashed border-zinc-800 rounded-sm bg-black/20 hover:border-zinc-700 transition-colors">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-transparent group-hover:border-zinc-600 transition-colors" />
          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-transparent group-hover:border-zinc-600 transition-colors" />
          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-transparent group-hover:border-zinc-600 transition-colors" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-transparent group-hover:border-zinc-600 transition-colors" />

          <span className="text-zinc-600 font-mono text-[11px]">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.slice(0, 500))}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Nishant is typing..." : "Type your message..."}
            className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-600 text-[12px] font-mono focus-visible:outline-none"
            disabled={isLoading}
            maxLength={500}
            autoComplete="off"
          />
          {isLoading ? (
            <button
              onClick={stopStreaming}
              className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Stop"
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-1.5 text-zinc-600 hover:text-zinc-200 transition-colors disabled:opacity-30 cursor-pointer"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          )}
        </div>
        <div className="flex justify-between px-1 mt-1.5">
          <span className="text-[9px] font-mono text-zinc-700">{input.length}/500</span>
          <span className="text-[9px] font-mono text-zinc-700">gemini-2.5-flash</span>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
