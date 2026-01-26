"use server";

import { users, borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq, count } from "drizzle-orm";

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        universityId: users.universityId,
        universityCard: users.universityCard,
        status: users.status,
        role: users.role,
        lastActivityDate: users.lastActivityDate,
        createdAt: users.createdAt,
      })
      .from(users);

    // Get borrow counts for each user (safely handle if table doesn't exist)
    let borrowCountMap = new Map<string, number>();
    
    try {
      const borrowCounts = await db
        .select({
          userId: borrowRecords.userId,
          count: count(),
        })
        .from(borrowRecords)
        .groupBy(borrowRecords.userId);

      borrowCountMap = new Map(
        borrowCounts.map((b) => [b.userId, Number(b.count)])
      );
    } catch {
      // borrow_records table might not exist yet
      console.log("borrow_records table not available, skipping borrow counts");
    }

    const usersWithBorrowCount = allUsers.map((user) => ({
      ...user,
      borrowedBooks: borrowCountMap.get(user.id) || 0,
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(usersWithBorrowCount)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while fetching users",
    };
  }
};

export const updateUserRole = async (userId: string, role: "USER" | "ADMIN") => {
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));

    return {
      success: true,
      message: "User role updated successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while updating user role",
    };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // First delete all borrow records for this user
    await db.delete(borrowRecords).where(eq(borrowRecords.userId, userId));
    
    // Then delete the user
    await db.delete(users).where(eq(users.id, userId));

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while deleting the user",
    };
  }
};
