import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserBorrowedBooks } from "@/lib/actions/book";
import BorrowedBookCard from "@/components/BorrowedBookCard";

interface BorrowedBook {
  id: string;
  borrowDate: string;
  dueDate: string;
  status: string;
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    coverColor: string;
  } | null;
}

const Page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const result = await getUserBorrowedBooks(session.user.id);
  const borrowedBooks: BorrowedBook[] = result.success ? result.data : [];

  // Ayrı listeler: aktif ve iade edilmiş
  const activeBooks = borrowedBooks.filter((b) => b.status === "BORROWED");
  const returnedBooks = borrowedBooks.filter((b) => b.status === "RETURNED");

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
      </div>

      {/* Active Borrowed Books */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">
          Borrowed Books ({activeBooks.length})
        </h2>
        {activeBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-dark-300 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            <h3 className="text-lg font-medium text-white">No borrowed books</h3>
            <p className="text-light-500 mt-1">
              You haven&apos;t borrowed any books yet. Browse the library to find your next read!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeBooks.map((record) => (
              <BorrowedBookCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </section>

      {/* Returned Books */}
      {returnedBooks.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            Reading History ({returnedBooks.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {returnedBooks.map((record) => (
              <BorrowedBookCard key={record.id} record={record} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Page;
