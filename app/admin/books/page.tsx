import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllBooks } from "@/lib/admin/actions/book";
import BookTable from "@/components/admin/BookTable";
import { checkIsAdmin } from "@/lib/admin/auth";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  coverUrl: string;
  coverColor: string;
  createdAt: string;
}

interface PageProps {
  searchParams: Promise<{ query?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const isAdmin = await checkIsAdmin();
  const { query } = await searchParams;
  const result = await getAllBooks();
  const allBooks: Book[] = result.success ? result.data : [];

  // Arama filtrelemesi
  const books = query
    ? allBooks.filter((book: Book) => {
        const searchQuery = query.toLowerCase();
        return (
          book.title.toLowerCase().includes(searchQuery) ||
          book.author.toLowerCase().includes(searchQuery) ||
          book.genre.toLowerCase().includes(searchQuery)
        );
      })
    : allBooks;

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-primary-admin" />
          <h2 className="text-xl font-semibold">All Books</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-dark-400 hover:text-dark-500 transition-colors">
            <span>A-Z</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 16 4 4 4-4" />
              <path d="M7 20V4" />
              <path d="m21 8-4-4-4 4" />
              <path d="M17 4v16" />
            </svg>
          </button>
          {isAdmin && (
            <Button className="bg-primary-admin hover:bg-primary-admin/90" asChild>
              <Link href="/admin/books/new" className="text-white">
                + Create a New Book
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-7">
        <BookTable books={books} isAdmin={isAdmin} />
      </div>
    </section>
  );
};

export default Page;
