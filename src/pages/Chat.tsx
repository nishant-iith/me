import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Send, Square, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat, SUGGESTED_PROMPTS } from '@/features/chat';
import type { ChatMessage } from '@/features/chat';
import { PatternDivider } from '~components/SharedLayout';

// ── Full-page message row ───────────────────────────────────────
const ChatMessageRow = memo(function ChatMessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%]`}>
        <div className="text-[9px] font-mono text-zinc-600 mb-1">
          {isUser ? '// you' : '// nishant'}
        </div>
        <div
          className={`px-3 py-2.5 rounded-sm text-[12px] font-mono leading-relaxed ${
            isUser
              ? 'bg-zinc-800/60 text-zinc-200 border border-zinc-700/30'
              : 'text-zinc-400 border-l-2 border-zinc-700 pl-3'
          }`}
        >
          <span className="whitespace-pre-wrap break-words">{message.content}</span>
          {message.isStreaming && (
            <span className="inline-block w-1.5 h-3.5 bg-blue-500 ml-0.5 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
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
    sendMessage(text);
  }, [sendMessage]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in duration-500">
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
            title="Clear conversation"
          >
            {/* Corner accents */}
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
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
        {messages.map(msg => (
          <ChatMessageRow key={msg.id} message={msg} />
        ))}

        {/* Suggested Prompts */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTED_PROMPTS.map((s: string) => (
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
          <div className="text-[10px] font-mono text-red-400/70 text-center py-2" role="alert" aria-live="polite">
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
            placeholder="Type your message\u2026"
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
