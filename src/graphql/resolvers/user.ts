import { db } from '../../db/db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import Helper from '../../helpers';
import { error as logError } from '../../helpers/logger';
import { authenticateUser } from '../../services/auth.service';

export const userResolver = {
  Query: {
    getUser: async (_parent: any, _args: any, context: any) => {
      if (!context.user) throw new Error('User not authenticated');

      const user = await db
        .select()
        .from(users)
        .where(eq(context.user.id, users.id))
        .limit(1)
        .execute();

      if (!user) throw new Error('User Not found');

      return user[0];
    },

    getAllUsers: async () => {
      try {
        const allUsers = await db.select().from(users).execute();

        if (!allUsers.length) {
          throw new Error('No users found');
        }

        return allUsers;
      } catch (error) {
        let errorMessage = "Error fetching users"

        if (error instanceof Error && error.name === 'AggregateError') {
          errorMessage =
            "Failed to connect to the database. Please check your database connection and network settings."
        } else if (error instanceof Error) {
          errorMessage = `Error fetching users: ${error.message}`
        }

        if(error instanceof Error){
          logError({
            message:"Error fetching users",
            params:{
              name:error.name,
              message:errorMessage,
              stack:error.stack
            }
          })
        }

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
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1)
        .execute();

      if (existingUser) throw new Error('Email already in use');

      const hashedPassword = Helper.hash(input.password, 10);

      try {
        const newUser = await db
          .insert(users)
          .values({
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            password: hashedPassword,
            role: input.role || 'artist',
          })
          .returning()
          .execute();

        // return {
        //   id: newUser[0].id,
        //   first_name: newUser[0].first_name,
        //   last_name: newUser[0].last_name,
        //   email: newUser[0].email,
        //   role: newUser[0].role,
        //   created_at: newUser[0].created_at,
        //   updated_at: newUser[0].updated_at,
        // };

        return newUser[0];
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

    login: async (_parent: any, args: { email: string; password: string }) => {
      try {
        const token = await authenticateUser(args.email, args.password);

        return { token };
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
  },
};
