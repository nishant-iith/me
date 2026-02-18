import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Send, Square, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat, SUGGESTED_PROMPTS } from '@/features/chat';
import type { ChatMessage } from '@/features/chat';
import { PatternDivider } from '~components/SharedLayout';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (!audioCtx) {
        try {
            const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            audioCtx = new Ctor();
        } catch {
            return null;
        }
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    if (audioCtx.state === 'closed') {
        try {
            const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            audioCtx = new Ctor();
        } catch {
            return null;
        }
    }
    return audioCtx;
}

function playKeySound(): void {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    try {
        const now = ctx.currentTime;
        const freq = 400 + Math.random() * 300;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
    } catch {
        // Ignore audio errors
    }
}

// ── Streaming Message ─────────────────────────────────────────────
const StreamingMessage = memo(function StreamingMessage({
  content,
  isStreaming
}: {
  content: string;
  isStreaming: boolean;
}) {
  const [displayLen, setDisplayLen] = useState(0);
  const contentRef = useRef(content);
  const displayLenRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  contentRef.current = content;

  useEffect(() => {
    if (content.length === 0) {
      displayLenRef.current = 0;
      setDisplayLen(0);
    }
  }, [content]);

  useEffect(() => {
    const tick = () => {
      const cur = displayLenRef.current;
      const target = contentRef.current;

      if (cur < target.length) {
        const ch = target[cur];
        if (ch && ch !== ' ' && ch !== '\n') playKeySound();

        displayLenRef.current = cur + 1;
        setDisplayLen(cur + 1);

        const delay = 30 + Math.random() * 30;
        timerRef.current = setTimeout(tick, delay);
      }
    };

    if (contentRef.current.length > displayLenRef.current && !timerRef.current) {
      tick();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [content, displayLen]);

  const visible = content.slice(0, displayLen);
  const showCursor = isStreaming || displayLen < content.length;

  return (
    <span className="whitespace-pre-wrap break-words">
      {visible}
      {showCursor && (
        <span className="inline-block w-[2px] h-[1em] bg-blue-500 ml-[1px] align-text-bottom animate-pulse" />
      )}
    </span>
  );
});

// ── Chat Message Row ──────────────────────────────────────────────
const ChatMessageRow = memo(function ChatMessageRow({
  message,
  isLatest
}: {
  message: ChatMessage;
  isLatest: boolean;
}) {
  const isUser = message.role === 'user';
  const shouldStream = !!message.isStreaming && isLatest;

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
          ) : shouldStream ? (
            <StreamingMessage content={message.content} isStreaming />
          ) : (
            <span className="whitespace-pre-wrap break-words">{message.content}</span>
          )}
        </div>
      </div>
    </div>
  );
});

// ── Chat Page ─────────────────────────────────────────────────────
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
    getAudioContext();
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
    getAudioContext();
    sendMessage(text);
  }, [sendMessage]);

  return (
    <div
      className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in duration-500"
      onClick={() => getAudioContext()}
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
