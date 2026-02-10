import { useState, useCallback, useRef } from 'react';
import type { ChatMessage } from '../types';
import { streamChat } from '../api/chatApi';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! I'm Nishant — or well, an AI version of me. Ask me anything about my work, skills, or just say hi.",
  timestamp: Date.now(),
  isStreaming: false
};

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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

    // Build history for API (exclude welcome message and the new empty assistant message)
    const history = [
      ...messages.filter(m => m.id !== 'welcome'),
      userMessage
    ].map(m => ({
      role: m.role,
      content: m.content
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    await streamChat(
      history,
      // onChunk — append text to streaming message
      (text) => {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: m.content + text }
              : m
          )
        );
      },
      // onDone — mark streaming complete
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
      // onError — show error, set fallback content
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
  }, [messages, isLoading]);

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

  return { messages, isLoading, error, sendMessage, stopStreaming, clearChat };
}
