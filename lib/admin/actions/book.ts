"use server";

import { books } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { checkIsAdmin } from "@/lib/admin/auth";

export const createBook = async (params: BookParams) => {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Only admins can create books",
      };
    }

    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const getAllBooks = async () => {
  try {
    const allBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        rating: books.rating,
        totalCopies: books.totalCopies,
        availableCopies: books.availableCopies,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
        createdAt: books.createdAt,
      })
      .from(books);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(allBooks)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while fetching books",
    };
  }
};

export const deleteBook = async (bookId: string) => {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Only admins can delete books",
      };
    }

    await db.delete(books).where(eq(books.id, bookId));

    return {
      success: true,
      message: "Book deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while deleting the book",
    };
  }
};

export const getBookById = async (bookId: string) => {
  try {
    const book = await db
      .select()
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (book.length === 0) {
      return {
        success: false,
        message: "Book not found",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(book[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while fetching the book",
    };
  }
};

export const updateBook = async (bookId: string, params: Partial<BookParams>) => {
  try {
    // Admin kontrolü
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Only admins can update books",
      };
    }

    const updatedBook = await db
      .update(books)
      .set(params)
      .where(eq(books.id, bookId))
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while updating the book",
    };
  }
};
