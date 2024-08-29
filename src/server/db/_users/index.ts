import { eq } from "drizzle-orm";
import { db } from "..";
import { type InsertUser, users as usersTable } from "../schema";

export async function CreateUser({ user }: { user: InsertUser }) {
  await db.insert(usersTable).values({
    id: user.id,
    email: user.email,
    name: user.name,
    profileImage: user.profileImage,
  });
}

export async function GetUsers() {
  const users = await db.query.users.findMany();
  return users;
}

export async function GetUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(usersTable.id, userId),
  });
  return user;
}

export async function UpdateUser({
  user,
  userId,
}: {
  userId: string;
  user: Omit<InsertUser, "createdAt" | "updatedAt">;
}) {
  const updatedUser = await db
    .update(usersTable)
    .set({
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
    })
    .where(eq(usersTable.id, userId))
    .returning();

  return updatedUser;
}

export async function DeleteUser({ userId }: { userId: string }) {
  await db.delete(usersTable).where(eq(usersTable.id, userId)).returning();

  return true;
}
