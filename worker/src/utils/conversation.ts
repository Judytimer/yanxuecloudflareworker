import { SYSTEM_PROMPT } from '../ai/prompt';

interface MessageInput {
  role: string;
  content: string;
}

/**
 * 构建消息历史（简化版）
 * 仅支持前端传递，不存储
 */
export function buildMessageHistory(
  userMessage: string,
  history?: MessageInput[]
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  // 添加历史消息（最多保留最近10轮）
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10);
    recentHistory.forEach((msg) => {
      messages.push({
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
      });
    });
  }

  // 添加当前用户消息
  messages.push({ role: 'user', content: userMessage });

  return messages;
}

