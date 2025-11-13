import MessageBubble from './MessageBubble';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-center gap-2 text-neutral-medium text-sm">
          <span>AI正在思考</span>
          <span className="animate-pulse">...</span>
        </div>
      )}
    </div>
  );
}

