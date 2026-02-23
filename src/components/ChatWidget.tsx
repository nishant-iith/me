import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { MessageSquare, X, Trash2, Send, Square, ArrowUpRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChat, SUGGESTED_PROMPTS, StreamingMessage, initAudioContext } from '@/features/chat';
import type { ChatMessage } from '@/features/chat';

const WIDGET_SUGGESTIONS = SUGGESTED_PROMPTS.slice(0, 4);

const ChatBubble = memo(function ChatBubble({
  message,
  isLatest,
}: {
  message: ChatMessage;
  isLatest: boolean;
}) {
  const isUser = message.role === 'user';
  const shouldStream = !!message.isStreaming && isLatest;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-sm text-[12px] font-mono leading-relaxed ${
          isUser
            ? 'bg-zinc-800 text-zinc-200 border border-zinc-700/50'
            : 'text-zinc-400'
        }`}
      >
        {shouldStream ? (
          <StreamingMessage content={message.content} isStreaming />
        ) : (
          <span className="whitespace-pre-wrap break-words">{message.content}</span>
        )}
      </div>
    </div>
  );
});

function ChatWidgetInner() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, error, sendMessage, stopStreaming, clearChat, resetError } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => inputRef.current?.focus(), 100);
      resetError();
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, resetError]);

  // Global keyboard shortcut: Ctrl+. to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '.' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    initAudioContext();
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
    initAudioContext();
    sendMessage(text);
  }, [sendMessage]);

  const handleExpand = useCallback(() => {
    setIsOpen(false);
    navigate('/chat');
  }, [navigate]);

  const showSuggestions = messages.length === 1 && messages[0].id === 'welcome';

  // ── Closed: Chat Bubble Button ──
  if (!isOpen) {
    return (
      <button
        onClick={() => { initAudioContext(); setIsOpen(true); }}
        className="fixed bottom-8 right-8 z-[100] group flex items-center justify-center bg-zinc-950/80 backdrop-blur-md border border-dashed border-zinc-800 text-zinc-500 transition-[border-color,color,box-shadow] duration-300 rounded-full h-12 w-12 hover:border-zinc-600 hover:text-zinc-300 shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        aria-label="Open chat (Ctrl+.)"
        title="Chat with Nishant (Ctrl+.)"
      >
        <MessageSquare size={18} className="group-hover:text-blue-400 transition-colors" />
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse motion-reduce:animate-none" aria-hidden="true" />
      </button>
    );
  }

  // ── Open: Chat Panel ──
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99] sm:hidden"
        onClick={() => setIsOpen(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(false); }}
        role="button"
        tabIndex={0}
        aria-label="Close chat overlay"
      />

      <div className="fixed z-[100] sm:bottom-8 sm:right-8 sm:w-[380px] sm:max-w-[calc(100vw-2rem)] inset-0 sm:inset-auto animate-in fade-in duration-200">
        <div className="relative bg-[#18181b] sm:border sm:border-dashed sm:border-zinc-800 sm:rounded-xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-[500px] sm:max-h-[calc(100vh-6rem)]">

          {/* Corner Accents (desktop only) */}
          <div className="hidden sm:block absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-600 z-10" />
          <div className="hidden sm:block absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-600 z-10" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-600 z-10" />
          <div className="hidden sm:block absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-600 z-10" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-dashed border-zinc-800 bg-zinc-950/50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span className="font-doto text-[11px] text-zinc-400 tracking-widest uppercase">
                Chat://Nishant
              </span>
              {isLoading && (
                <span className="text-[9px] font-mono text-blue-400 animate-pulse ml-1">typing...</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleExpand}
                className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-sm"
                aria-label="Open full chat page"
                title="Expand"
              >
                <ArrowUpRight size={14} />
              </button>
              <button
                onClick={clearChat}
                className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-sm"
                aria-label="Clear chat"
                title="Clear"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-sm"
                aria-label="Close chat"
                title="Close (Esc)"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.map((msg, index) => (
              <ChatBubble key={msg.id} message={msg} isLatest={index === messages.length - 1} />
            ))}

            {/* Suggested Prompts */}
            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {WIDGET_SUGGESTIONS.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-[10px] font-mono text-zinc-500 px-2.5 py-1.5 border border-dashed border-zinc-800 rounded-sm hover:border-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="text-[10px] font-mono text-red-400/70 text-center py-1" role="alert" aria-live="polite">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-dashed border-zinc-800 px-3 py-2.5 bg-black/20 shrink-0 sm:mb-0 mb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything\u2026"
                className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-600 text-[12px] font-mono focus-visible:outline-none"
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
                  <Square size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-1.5 text-zinc-600 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-sm"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              )}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] font-mono text-zinc-700">
                {input.length}/500
              </span>
              <span className="text-[9px] font-mono text-zinc-700">
                powered by gemini
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ChatWidget() {
  const location = useLocation();
  
  if (location.pathname === '/chat') {
    return null;
  }
  
  return <ChatWidgetInner />;
}
