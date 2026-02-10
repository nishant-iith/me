export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface ChatRequestMessage {
  role: 'user' | 'assistant';
  content: string;
}
