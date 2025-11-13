import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';

// MessageInput类型
const MessageInputType = new GraphQLInputObjectType({
  name: 'MessageInput',
  fields: {
    role: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// SendMessageInput类型
const SendMessageInputType = new GraphQLInputObjectType({
  name: 'SendMessageInput',
  fields: {
    content: { type: new GraphQLNonNull(GraphQLString) },
    sessionId: { type: GraphQLString },
    history: { type: new GraphQLList(MessageInputType) },
  },
});

// MessageResponse类型
const MessageResponseType = new GraphQLObjectType({
  name: 'MessageResponse',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userMessage: { type: new GraphQLNonNull(GraphQLString) },
    aiResponse: { type: new GraphQLNonNull(GraphQLString) },
    timestamp: { type: new GraphQLNonNull(GraphQLString) },
    sessionId: { type: GraphQLString },
  },
});

// Root Mutation
const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    sendMessage: {
      type: new GraphQLNonNull(MessageResponseType),
      args: {
        input: { type: new GraphQLNonNull(SendMessageInputType) },
      },
      resolve: async (_, { input }, context) => {
        const { resolvers } = context;
        return resolvers.sendMessage(input, context);
      },
    },
  }),
});

// Root Query（MVP版本最小化，只保留占位符）
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    _empty: {
      type: GraphQLString,
      resolve: () => null,
    },
  },
});

// Schema
export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

