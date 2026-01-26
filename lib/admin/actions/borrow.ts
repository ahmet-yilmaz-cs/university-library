"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { checkIsAdmin } from "@/lib/admin/auth";

export const getAllBorrowRecords = async () => {
  try {
    const records = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,
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
      .orderBy(borrowRecords.createdAt);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(records)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while fetching borrow records",
    };
  }
};

export const returnBook = async (recordId: string, bookId: string) => {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Only admins can process returns",
      };
    }

    // Update borrow record status
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: new Date().toISOString().split("T")[0],
      })
      .where(eq(borrowRecords.id, recordId));

    // Increase available copies
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (book.length > 0) {
      await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies + 1 })
        .where(eq(books.id, bookId));
    }

    return {
      success: true,
      message: "Book returned successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while processing the return",
    };
  }
};
