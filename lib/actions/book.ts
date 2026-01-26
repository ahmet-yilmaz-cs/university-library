"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, and, desc } from "drizzle-orm";
import dayjs from "dayjs";
import { auth } from "@/auth";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    // Kullanıcının bu kitabı zaten ödünç alıp almadığını kontrol et
    const existingBorrow = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED")
        )
      )
      .limit(1);

    if (existingBorrow.length > 0) {
      return {
        success: false,
        error: "You have already borrowed this book",
      };
    }

    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

// Kullanıcının ödünç aldığı kitapları getir
export const getUserBorrowedBooks = async (userId: string) => {
  try {
    const records = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        status: borrowRecords.status,
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          genre: books.genre,
          coverUrl: books.coverUrl,
          coverColor: books.coverColor,
        },
      })
      .from(borrowRecords)
      .leftJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.userId, userId))
      .orderBy(desc(borrowRecords.createdAt));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(records)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "An error occurred while fetching borrowed books",
    };
  }
};

// Kullanıcı kendi kitabını iade et (sadece kendi kaydını)
export const returnOwnBook = async (recordId: string) => {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be logged in to return a book",
      };
    }

    // Kaydın bu kullanıcıya ait olduğunu ve BORROWED durumunda olduğunu kontrol et
    const record = await db
      .select({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        status: borrowRecords.status,
      })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (!record.length) {
      return {
        success: false,
        error: "Borrow record not found",
      };
    }

    // Kullanıcının kendi kaydı mı kontrol et
    if (record[0].userId !== session.user.id) {
      return {
        success: false,
        error: "You can only return your own borrowed books",
      };
    }

    // Kitap zaten iade edilmiş mi kontrol et
    if (record[0].status === "RETURNED") {
      return {
        success: false,
        error: "This book has already been returned",
      };
    }

    // İade işlemini gerçekleştir
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: new Date().toISOString().split("T")[0],
      })
      .where(eq(borrowRecords.id, recordId));

    // Kitabın mevcut kopya sayısını artır
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, record[0].bookId))
      .limit(1);

    if (book.length > 0) {
      await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies + 1 })
        .where(eq(books.id, record[0].bookId));
    }

    return {
      success: true,
      message: "Book returned successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "An error occurred while returning the book",
    };
  }
};
