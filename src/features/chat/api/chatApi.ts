import type { ChatRequestMessage } from '../types';

const WORKER_URL = import.meta.env.VITE_CHATBOT_API_URL ?? 'https://chatbot-api.iith-nishant.workers.dev';

/**
 * Stream chat response from the chatbot Cloudflare Worker.
 * Reads the SSE stream and calls onChunk for each text fragment.
 */
export async function streamChat(
  messages: ChatRequestMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch(`${WORKER_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      onError((errorData as { error?: string }).error || `Error: ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('Streaming not supported in this browser');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            onDone();
            return;
          }

          try {
            const parsed = JSON.parse(data) as { text?: string; error?: string };
            if (parsed.text) {
              onChunk(parsed.text);
            }
            if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    }

    onDone();
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    onError(err instanceof Error ? err.message : 'Connection failed. Please try again.');
  }
}
