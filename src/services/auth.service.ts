import { db } from '../db/db';
import { users } from '../db/schema';
import Helper from '../helpers';
import { eq } from 'drizzle-orm';

export async function authenticateUser(email: string, password: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute();

  if (user.length === 0) throw new Error('User Account does not exist!');

  const foundUser = user[0];

  const isPasswordValid = Helper.correctPassword(password, foundUser.password);

  if (!isPasswordValid) throw new Error('Invalid Credentials');

  const token = Helper.signToken({ id: foundUser.id.toString(), email: foundUser.email });

  return {
    token,
    user: {
      id: foundUser.id,
      email: foundUser.email,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      role: foundUser.role,
    },
  };
}
