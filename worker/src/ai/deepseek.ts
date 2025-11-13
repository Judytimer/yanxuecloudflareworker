interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

/**
 * 调用DeepSeek API
 */
export async function callDeepSeekAPI(
  messages: DeepSeekMessage[],
  apiKey: string
): Promise<{ content: string }> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API错误 (${response.status}): ${error}`);
  }

  const data: DeepSeekResponse = await response.json();
  const content = data.choices[0]?.message?.content || '抱歉，我暂时无法回复。';

  return { content };
}

