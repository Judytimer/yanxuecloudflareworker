import { callDeepSeekAPI } from '../ai/deepseek';
import { validateInput } from '../utils/validation';
import { buildMessageHistory } from '../utils/conversation';
import { AppError, ErrorType } from '../utils/errors';
import { Env } from '../types/env';

interface SendMessageInput {
  content: string;
  sessionId?: string;
  history?: Array<{ role: string; content: string }>;
}

interface MessageResponse {
  id: string;
  userMessage: string;
  aiResponse: string;
  timestamp: string;
  sessionId: string | null;
}

export const resolvers = {
  async sendMessage(
    input: SendMessageInput,
    context: { env: Env }
  ): Promise<MessageResponse> {
    try {
      // 1. 验证输入
      validateInput(input.content);

      // 2. 构建消息历史
      const messages = buildMessageHistory(input.content, input.history);

      // 3. 调用AI API
      const aiResponse = await callDeepSeekAPI(messages, context.env.DEEPSEEK_API_KEY);

      // 4. 生成响应
      const response: MessageResponse = {
        id: crypto.randomUUID(),
        userMessage: input.content,
        aiResponse: aiResponse.content,
        timestamp: new Date().toISOString(),
        sessionId: input.sessionId || null,
      };

      return response;
    } catch (error: any) {
      // 错误处理
      if (error instanceof AppError) {
        throw error;
      }

      // DeepSeek API错误处理
      if (error.message?.includes('DeepSeek API错误')) {
        if (error.message.includes('429')) {
          throw new AppError(ErrorType.AI_API_ERROR, '请求过于频繁，请稍后再试', 429);
        } else if (error.message.includes('401')) {
          throw new AppError(ErrorType.AI_API_ERROR, 'DeepSeek API密钥配置错误', 500);
        } else {
          throw new AppError(ErrorType.AI_API_ERROR, 'DeepSeek服务暂时不可用，请稍后再试', 503);
        }
      }

      // 其他错误
      throw new AppError(ErrorType.INTERNAL_ERROR, '服务器内部错误', 500);
    }
  },
};

