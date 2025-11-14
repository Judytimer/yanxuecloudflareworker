// 最小化测试 - 只使用基础 API，不导入任何 GraphQL 库
export default {
  async fetch(request: Request): Promise<Response> {
    return new Response(JSON.stringify({
      success: true,
      message: 'Minimal Worker is running',
      url: request.url,
      method: request.method,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
