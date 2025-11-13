import { describe, it, expect } from 'vitest';
import { validateInput } from './validation';
import { AppError, ErrorType } from './errors';

describe('validateInput', () => {
  it('应该接受有效的输入', () => {
    expect(() => validateInput('这是一条有效的消息')).not.toThrow();
  });

  it('应该拒绝空字符串', () => {
    expect(() => validateInput('')).toThrow(AppError);
    expect(() => validateInput('   ')).toThrow(AppError);
  });

  it('应该拒绝过长的消息', () => {
    const longMessage = 'a'.repeat(501);
    expect(() => validateInput(longMessage)).toThrow(AppError);
  });

  it('应该接受恰好500字符的消息', () => {
    const message = 'a'.repeat(500);
    expect(() => validateInput(message)).not.toThrow();
  });

  it('应该抛出正确的错误类型', () => {
    try {
      validateInput('');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).type).toBe(ErrorType.INVALID_INPUT);
      expect((error as AppError).statusCode).toBe(400);
    }
  });
});

