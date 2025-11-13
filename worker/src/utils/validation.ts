import { AppError, ErrorType } from './errors';

/**
 * 验证用户输入
 */
export function validateInput(content: string): void {
  // 长度限制
  if (!content || content.trim().length === 0) {
    throw new AppError(ErrorType.INVALID_INPUT, '消息内容不能为空', 400);
  }

  if (content.length > 500) {
    throw new AppError(ErrorType.INVALID_INPUT, '消息内容过长（最多500字）', 400);
  }
}

