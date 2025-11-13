import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvers } from './resolvers';
import { Env } from '../types/env';
import * as deepseekModule from '../ai/deepseek';
import { AppError, ErrorType } from '../utils/errors';

// Mock DeepSeek API
vi.mock('../ai/deepseek', () => ({
  callDeepSeekAPI: vi.fn(),
}));

describe('resolvers', () => {
  let env: Env;
  let mockCallDeepSeekAPI: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    env = {
      DEEPSEEK_API_KEY: 'test-api-key',
    };
    mockCallDeepSeekAPI = vi.mocked(deepseekModule.callDeepSeekAPI);
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('应该成功发送消息并返回响应', async () => {
      mockCallDeepSeekAPI.mockResolvedValue({
        content: 'AI回复内容',
      });

      const input = {
        content: '用户消息',
        sessionId: 'test-session-id',
      };

      const result = await resolvers.sendMessage(input, { env });

      expect(result).toHaveProperty('id');
      expect(result.userMessage).toBe('用户消息');
      expect(result.aiResponse).toBe('AI回复内容');
      expect(result.sessionId).toBe('test-session-id');
      expect(result.timestamp).toBeDefined();
      expect(mockCallDeepSeekAPI).toHaveBeenCalledTimes(1);
    });

    it('应该处理没有 sessionId 的情况', async () => {
      mockCallDeepSeekAPI.mockResolvedValue({
        content: 'AI回复',
      });

      const input = {
        content: '用户消息',
      };

      const result = await resolvers.sendMessage(input, { env });

      expect(result.sessionId).toBeNull();
    });

    it('应该处理历史消息', async () => {
      mockCallDeepSeekAPI.mockResolvedValue({
        content: 'AI回复',
      });

      const input = {
        content: '新消息',
        history: [
          { role: 'user', content: '历史消息1' },
          { role: 'assistant', content: '历史回复1' },
        ],
      };

      await resolvers.sendMessage(input, { env });

      expect(mockCallDeepSeekAPI).toHaveBeenCalled();
      const callArgs = mockCallDeepSeekAPI.mock.calls[0];
      expect(callArgs[0].length).toBeGreaterThan(2); // 系统消息 + 历史消息 + 新消息
    });

    it('应该拒绝空消息', async () => {
      const input = {
        content: '',
      };

      await expect(resolvers.sendMessage(input, { env })).rejects.toThrow(AppError);
      expect(mockCallDeepSeekAPI).not.toHaveBeenCalled();
    });

    it('应该拒绝过长的消息', async () => {
      const input = {
        content: 'a'.repeat(501),
      };

      await expect(resolvers.sendMessage(input, { env })).rejects.toThrow(AppError);
      expect(mockCallDeepSeekAPI).not.toHaveBeenCalled();
    });

    it('应该处理 DeepSeek API 429 错误', async () => {
      mockCallDeepSeekAPI.mockRejectedValue(
        new Error('DeepSeek API错误 (429): Rate limit exceeded')
      );

      const input = {
        content: '用户消息',
      };

      await expect(resolvers.sendMessage(input, { env })).rejects.toThrow(AppError);
      try {
        await resolvers.sendMessage(input, { env });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(429);
        expect((error as AppError).type).toBe(ErrorType.AI_API_ERROR);
      }
    });

    it('应该处理 DeepSeek API 401 错误', async () => {
      mockCallDeepSeekAPI.mockRejectedValue(
        new Error('DeepSeek API错误 (401): Unauthorized')
      );

      const input = {
        content: '用户消息',
      };

      await expect(resolvers.sendMessage(input, { env })).rejects.toThrow(AppError);
      try {
        await resolvers.sendMessage(input, { env });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(500);
        expect((error as AppError).type).toBe(ErrorType.AI_API_ERROR);
      }
    });

    it('应该处理其他 DeepSeek API 错误', async () => {
      mockCallDeepSeekAPI.mockRejectedValue(
        new Error('DeepSeek API错误 (503): Service unavailable')
      );

      const input = {
        content: '用户消息',
      };

      await expect(resolvers.sendMessage(input, { env })).rejects.toThrow(AppError);
      try {
        await resolvers.sendMessage(input, { env });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(503);
        expect((error as AppError).type).toBe(ErrorType.AI_API_ERROR);
      }
    });
  });
});

