/* eslint-disable @typescript-eslint/no-explicit-any */
import { info, error as logError } from '../../helpers/logger';
import { authenticateUser } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

export const userResolver = {
  Query: {
    getUser: async (_parent: any, _args: any, context: { user: any }) => {
      console.log('context user: ', context.user);

      if (!context.user) throw new Error('User not authenticated');

      const user = await UserService.getUserById(context.user.id);

      if (!user) throw new Error('User Not found');

      return user;
    },

    getAllUsers: async () => {
      try {
        const allUsers = await UserService.getAllUsers();

        info({ message: `Fetched ${allUsers.length} users.` });

        return allUsers;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? `Error fetching users: ${error.message}`
            : 'Error fetching users';

        logError({
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
      },
    ) => {
      const existingUser = await UserService.getUserByEmail(input.email);

      if (existingUser) {
        info({ message: 'Account Found', params: { existingUser } });
        throw new Error('Email already in use');
      }

      try {
        const newUser = await UserService.createUser(input);

        return newUser;
      } catch (error) {
        if (error instanceof Error) {
          logError({
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

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      try {
        return await authenticateUser(email, password);
      } catch (error) {
        if (error instanceof Error) {
          logError({
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
        first_name,
        last_name,
        password,
      }: { first_name?: string; last_name?: string; password?: string },
      context: { user: any },
    ) => {
      if (!context.user) throw new Error('User not authenticated');

      try {
        const updatedUser = await UserService.updateUserProfile(context.user.id, {
          first_name,
          last_name,
          password,
        });

        return updatedUser;
      } catch (error) {
        if (error instanceof Error) {
          logError({
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
