import { GraphQLClient } from 'graphql-request';

// 根据环境变量或默认值设置API地址
const API_URL =
  import.meta.env.VITE_API_URL || 'https://api.antech.store/graphql';

export const client = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

