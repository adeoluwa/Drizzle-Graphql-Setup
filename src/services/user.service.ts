import { db } from '../db/db';
import * as userSchema from '../db/schema/users';
import { eq } from 'drizzle-orm';
import Helper from '../helpers';

export const UserService = {
  async getUserById(userId: string) {
    const user = await db
      .select()
      .from(userSchema.users)
      .where(eq(userSchema.users.id, Number(userId)))
      .limit(1)
      .execute();

    return user[0] || null;
  },

  async getAllUsers() {
    return await db.select().from(userSchema.users).execute();
  },

  async getUserByEmail(email: string) {
    const user = await db
      .select()
      .from(userSchema.users)
      .where(eq(userSchema.users, email))
      .limit(1)
      .execute();

    return user[0] || null;
  },

  async createUser(input: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role?: 'artist' | 'dj' | null;
  }) {
    const hashedPassword = Helper.hash(input.password, 10);

    const newUser = await db
      .insert(userSchema.users)
      .values({
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        password: hashedPassword,
        role: input.role || 'artist',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning()
      .execute();

    return newUser[0];
  },

  async updateUserProfile(
    userId: string,
    updateData: { first_name?: string; last_name?: string; password?: string },
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateValues: any = {};

      if (updateData.first_name) {
        updateValues.first_name = updateData.first_name;
      }

      if (updateData.last_name) {
        updateValues.last_name = updateData.last_name;
      }

      // If password is provided, hash it before updating
      if (updateData.password) {
        updateValues.password = Helper.hash(updateData.password, 10);
      }

      updateValues.updated_at = new Date();

      const updatedUser = await db
        .update(userSchema.users)
        .set(updateValues)
        .where(eq(userSchema.users.id, Number(userId)))
        .returning()
        .execute();

      return updatedUser[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error updating user profile: ${error.message}`);
      }
      throw error;
    }
  },
};
