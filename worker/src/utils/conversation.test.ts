import { describe, it, expect } from 'vitest';
import { buildMessageHistory } from './conversation';

describe('buildMessageHistory', () => {
  it('应该包含系统提示和用户消息', () => {
    const messages = buildMessageHistory('你好');

    expect(messages.length).toBe(2);
    expect(messages[0].role).toBe('system');
    expect(messages[1].role).toBe('user');
    expect(messages[1].content).toBe('你好');
  });

  it('应该正确处理历史消息', () => {
    const history = [
      { role: 'user', content: '第一条消息' },
      { role: 'assistant', content: 'AI回复' },
    ];

    const messages = buildMessageHistory('第二条消息', history);

    expect(messages.length).toBe(4);
    expect(messages[0].role).toBe('system');
    expect(messages[1].role).toBe('user');
    expect(messages[1].content).toBe('第一条消息');
    expect(messages[2].role).toBe('assistant');
    expect(messages[2].content).toBe('AI回复');
    expect(messages[3].role).toBe('user');
    expect(messages[3].content).toBe('第二条消息');
  });

  it('应该限制历史消息数量为10轮', () => {
    // 创建25条消息（超过10轮的20条限制）
    const history = Array.from({ length: 25 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `消息${i}`,
    }));

    const messages = buildMessageHistory('新消息', history);

    // 系统消息 + 10轮历史（20条）+ 1条新消息 = 22条
    expect(messages.length).toBe(22);
    expect(messages[messages.length - 1].content).toBe('新消息');
    // 验证只保留了最后20条历史消息（索引5-24）
    expect(messages[1].content).toBe('消息5'); // 第一条历史消息应该是索引5
  });

  it('应该处理空历史', () => {
    const messages = buildMessageHistory('消息', []);

    expect(messages.length).toBe(2);
    expect(messages[1].content).toBe('消息');
  });
});

