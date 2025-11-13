import { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendMessage } from '../graphql/mutations';
import { Message } from '../types';

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载本地存储的对话历史
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_${sessionId}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // 转换timestamp字符串为Date对象
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        // 如果解析失败，使用默认欢迎消息
        setMessages([
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '你好！我是你的AI学习伙伴。有什么学习上的困难或想法，都可以告诉我。',
            timestamp: new Date(),
          },
        ]);
      }
    } else {
      // 欢迎消息
      setMessages([
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '你好！我是你的AI学习伙伴。有什么学习上的困难或想法，都可以告诉我。',
          timestamp: new Date(),
        },
      ]);
    }
  }, [sessionId]);

  // 保存对话历史到本地存储
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 构建历史消息
      const history = messages.map((msg) => ({
        role: msg.role.toUpperCase(),
        content: msg.content,
      }));

      const response = await sendMessage({
        content,
        sessionId,
        history,
      });

      const aiMessage: Message = {
        id: response.id,
        role: 'assistant',
        content: response.aiResponse,
        timestamp: new Date(response.timestamp),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'system',
        content: error.message || '发送消息失败，请稍后重试',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 md:block"
        onClick={onClose}
      />
      {/* 聊天窗口 */}
      <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-full md:max-w-md md:h-[600px] md:max-h-[calc(100vh-48px)] bg-white md:rounded-xl shadow-chat z-50 flex flex-col">
        <ChatHeader onClose={onClose} />
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </>
  );
}

