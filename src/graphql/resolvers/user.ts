/* eslint-disable @typescript-eslint/no-explicit-any */
export const userResolver = {
  Query: {
    getUser: async (_parent: any, _args: any, context: { user: any; container: any }) => {
      const { user, container } = context;
      console.log('context user: ', context.user);

      if (!context.user) throw new Error('User not authenticated');

      const userService = container.resolve('userService');
      const userData = await userService.getUserById(user.id);

      if (!userData) throw new Error('User Not found');

      return userData;
    },

    getAllUsers: async (_parent: any, _args: any, context: { container: any }) => {
      const { container } = context;
      const userService = container.resolve('userService');
      const logger = container.resolve('logger');
      try {
        const allUsers = await userService.getAllUsers();

        await logger.info({ message: `Fetched ${allUsers.length} users.` });

        return allUsers;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `Error fetching users: ${error.message}`
            : 'Error fetching users';

        await logger.error({
          message: 'Error fetching users',
          params: {
            name: (error as Error).name,
            message: errorMessage,
            stack: (error as Error).stack,
          },
        });

        throw new Error(errorMessage);
      }
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      {
        input,
      }: {
        input: {
          first_name: string;
          last_name: string;
          email: string;
          password: string;
          role?: 'artist' | 'dj' | null;
        };
      },context: {container: any},
    ) => {

      const {container} = context;
      const userService = container.resolve('userService');
      const logger = container.resolve('logger');

      const existingUser = await userService.getUserByEmail(input.email);

      if (existingUser) {
        await logger.info({ message: 'Account Found', params: { existingUser } });
        throw new Error('Email already in use');
      }

      try {
        const newUser = await userService.createUser(input);

        return newUser;
      } catch (error) {
        if (error instanceof Error) {
          await logger.error({
            message: 'Error creating user account',
            params: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          });
        }

        throw new Error('Error creating user');
      }
    },

    login: async (_: any, { email, password }: { email: string; password: string }, context:{container:any}) => {
      const {container} = context;
      const authService = container.resolve('authService');
      const logger = container.resolve('logger');
      try {
        return await authService.authenticateUser(email, password);
      } catch (error) {
        if (error instanceof Error) {
          await logger.error({
            message: 'Authentication failed',
            params: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          });
        }

        throw new Error('Authentication Error');
      }
    },

    updateProfile: async (
      _: any,

      {
        input,
      }: { input: { first_name?: string; last_name?: string; password?: string } },
      context: { user: any; container:any },
    ) => {
      const {user, container} = context;
      if (!user) throw new Error('User not authenticated');

      const userService = container.resolve('userService');
      const logger = container.resolve('logger');

      try {
        const updatedUser = await userService.updateUserProfile(user.id, input);

        await logger.info({ message: 'Updated User profile', params: { updatedUser } });

        return updatedUser;
      } catch (error) {
        if (error instanceof Error) {
          await logger.error({
            message: `Failed to update profile: ${error.message}`,
            params: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          });
        }

        throw new Error('Failed to update profile');
      }
    },
  },
};
