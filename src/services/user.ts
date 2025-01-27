import { db } from '../db/db';
import * as userSchema from '../db/schema/users';
import Helper from '../helpers';

export const createUser = async (
  newUser: userSchema.User,
): Promise<userSchema.UserWithoutPassword> => {
  newUser.password = Helper.hash(newUser.password, 10);

  const createdUser = await db.insert(userSchema.users).values(newUser).returning({
    id: userSchema.users.id,
    first_name: userSchema.users.first_name,
    last_name: userSchema.users.last_name,
    email: userSchema.users.email,
    role: userSchema.users.role,
    password: userSchema.users.password,
    created_at: userSchema.users.created_at,
    updated_at: userSchema.users.updated_at,
  });

  if (!createdUser) throw new Error('failed to add user');

  const user = createdUser[0];

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};
