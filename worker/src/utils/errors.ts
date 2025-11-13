/**
 * 错误类型枚举
 */
export enum ErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  AI_API_ERROR = 'AI_API_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * 应用错误类
 */
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

