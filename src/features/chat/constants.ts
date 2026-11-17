import type { ChatMessage } from './types';

export const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! I'm Nishant — or well, an AI version of me. Ask me anything about my work, skills, or just say hi.",
  timestamp: Date.now(),
  isStreaming: false
};

export const SUGGESTED_PROMPTS = [
  "What's your tech stack?",
  "Tell me about Goldman Sachs",
  "What do you do at DP World?",
  "What projects have you built?",
  "What courses have you taken?",
  "Tell me about yourself"
] as const;
