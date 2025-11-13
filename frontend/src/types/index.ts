export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface SendMessageInput {
  content: string;
  sessionId?: string;
  history?: Array<{
    role: string;
    content: string;
  }>;
}

export interface MessageResponse {
  id: string;
  userMessage: string;
  aiResponse: string;
  timestamp: string;
  sessionId: string | null;
}

