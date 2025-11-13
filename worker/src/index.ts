import { createYoga } from '@graphql-yoga/cloudflare';
import { schema } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { Env } from './types/env';
import { AppError } from './utils/errors';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS处理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 创建GraphQL Yoga实例
    const yoga = createYoga({
      schema,
      context: () => ({ env, resolvers }),
      fetchAPI: {
        Request,
        Response,
      },
    });

    try {
      // 处理GraphQL请求
      const response = await yoga.fetch(request);

      // 添加CORS头
      const headers = new Headers(response.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error: any) {
      // 错误处理
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message = error instanceof AppError ? error.message : '服务器内部错误';

      return new Response(
        JSON.stringify({
          errors: [
            {
              message,
              extensions: {
                code: error instanceof AppError ? error.type : 'INTERNAL_ERROR',
              },
            },
          ],
        }),
        {
          status: statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

