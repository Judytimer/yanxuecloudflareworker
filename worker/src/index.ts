import { createYoga } from 'graphql-yoga';
import { schema } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { Env } from './types/env';
import { AppError } from './utils/errors';

// 创建 GraphQL Yoga 实例（Cloudflare Workers 兼容配置）
function createYogaInstance(env: Env) {
  return createYoga({
    schema,
    context: () => ({ env, resolvers }),
    // Cloudflare Workers 必需配置
    fetchAPI: {
      Request,
      Response,
    },
    graphqlEndpoint: '/graphql',
    // 禁用 CORS（我们自己处理）
    cors: false,
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 验证必需的环境变量
    if (!env.DEEPSEEK_API_KEY) {
      return new Response(
        JSON.stringify({
          errors: [
            {
              message: 'DEEPSEEK_API_KEY 未配置',
              extensions: { code: 'CONFIGURATION_ERROR' },
            },
          ],
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

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
    const yoga = createYogaInstance(env);

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

