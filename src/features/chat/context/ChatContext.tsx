import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { ChatMessage } from '../types';
import { streamChat } from '../api/chatApi';
import { INITIAL_MESSAGE } from '../constants';

interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  stopStreaming: () => void;
  clearChat: () => void;
  resetError: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const location = useLocation();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (location.pathname !== '/chat') {
      abortRef.current?.abort();
      setIsLoading(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    const assistantId = `assistant-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);
    setError(null);

    const history = [
      ...messagesRef.current.filter(m => m.id !== 'welcome'),
      userMessage
    ].map(m => ({
      role: m.role,
      content: m.content
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    await streamChat(
      history,
      (text) => {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: m.content + text }
              : m
          )
        );
      },
      () => {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, isStreaming: false }
              : m
          )
        );
        setIsLoading(false);
      },
      (errorMsg) => {
        setError(errorMsg);
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: m.content || 'Sorry, something went wrong. Try again?', isStreaming: false }
              : m
          )
        );
        setIsLoading(false);
      },
      controller.signal
    );
  }, [isLoading]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setMessages(prev =>
      prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m)
    );
    setIsLoading(false);
  }, []);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([{
      ...INITIAL_MESSAGE,
      timestamp: Date.now()
    }]);
    setIsLoading(false);
    setError(null);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, error, sendMessage, stopStreaming, clearChat, resetError }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return ctx;
}
