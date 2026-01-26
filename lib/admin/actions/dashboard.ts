"use server";

import { db } from "@/database/drizzle";
import { books, users, borrowRecords } from "@/database/schema";
import { eq, count, desc } from "drizzle-orm";

export const getDashboardStats = async () => {
  try {
    // Total users count
    const totalUsersResult = await db
      .select({ count: count() })
      .from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Total books count
    const totalBooksResult = await db
      .select({ count: count() })
      .from(books);
    const totalBooks = totalBooksResult[0]?.count || 0;

    // Borrowed books count (active borrows)
    let borrowedBooks = 0;
    try {
      const borrowedResult = await db
        .select({ count: count() })
        .from(borrowRecords)
        .where(eq(borrowRecords.status, "BORROWED"));
      borrowedBooks = borrowedResult[0]?.count || 0;
    } catch {
      // Table might not exist
    }

    return {
      success: true,
      data: {
        totalUsers,
        totalBooks,
        borrowedBooks,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to fetch dashboard stats",
    };
  }
};

export const getRecentBorrowRequests = async (limit: number = 5) => {
  try {
    const records = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        status: borrowRecords.status,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        },
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          coverUrl: books.coverUrl,
          coverColor: books.coverColor,
        },
      })
      .from(borrowRecords)
      .leftJoin(users, eq(borrowRecords.userId, users.id))
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.status, "BORROWED"))
      .orderBy(desc(borrowRecords.createdAt))
      .limit(limit);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(records)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      data: [],
    };
  }
};

export const getPendingAccountRequests = async (limit: number = 5) => {
  try {
    const pendingUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(desc(users.createdAt))
      .limit(limit);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(pendingUsers)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      data: [],
    };
  }
};

export const getRecentlyAddedBooks = async (limit: number = 6) => {
  try {
    const recentBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
        createdAt: books.createdAt,
      })
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(limit);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(recentBooks)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      data: [],
    };
  }
};
