import { client } from './client';
import { SendMessageInput, MessageResponse } from '../types';

const SEND_MESSAGE_MUTATION = `
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      userMessage
      aiResponse
      timestamp
      sessionId
    }
  }
`;

export async function sendMessage(
  input: SendMessageInput
): Promise<MessageResponse> {
  const data = await client.request<{ sendMessage: MessageResponse }>(
    SEND_MESSAGE_MUTATION,
    { input }
  );
  return data.sendMessage;
}

