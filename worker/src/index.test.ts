import { describe, it, expect, beforeEach } from 'vitest';
import worker from './index';
import { Env } from './types/env';

describe('Worker', () => {
  let env: Env;

  beforeEach(() => {
    env = {
      DEEPSEEK_API_KEY: 'test-api-key',
      ENVIRONMENT: 'test',
    };
  });

  describe('CORS处理', () => {
    it('应该正确处理 OPTIONS 请求', async () => {
      const request = new Request('https://api.antech.store/graphql', {
        method: 'OPTIONS',
      });

      const response = await worker.fetch(request, env, {} as ExecutionContext);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });
  });

  describe('GraphQL请求处理', () => {
    it('应该返回 GraphQL 响应', async () => {
      const query = `
        query {
          _empty
        }
      `;

      const request = new Request('https://api.antech.store/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const response = await worker.fetch(request, env, {} as ExecutionContext);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      
      const data = await response.json();
      expect(data).toHaveProperty('data');
    });

    it('应该处理无效的 GraphQL 查询', async () => {
      const query = `
        query {
          invalidField
        }
      `;

      const request = new Request('https://api.antech.store/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const response = await worker.fetch(request, env, {} as ExecutionContext);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('errors');
    });
  });
});

