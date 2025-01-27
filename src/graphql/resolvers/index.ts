import { userResolver } from './user';

export const resolvers = {
  Query: {
    ...userResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};
