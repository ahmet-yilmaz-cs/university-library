"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const checkIsAdmin = async (): Promise<boolean> => {
  const session = await auth();

  if (!session?.user?.id) return false;

  const result = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return result[0]?.role === "ADMIN";
};

export const requireAdmin = async () => {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return true;
};
