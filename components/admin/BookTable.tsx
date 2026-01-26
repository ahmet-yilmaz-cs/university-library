"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deleteBook } from "@/lib/admin/actions/book";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import BookCover from "@/components/BookCover";

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

interface BookTableProps {
    books: Book[];
    isAdmin?: boolean;
}

const BookTable = ({ books, isAdmin = false }: BookTableProps) => {
    const router = useRouter();
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const sortedBooks = [...books].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleDelete = async (bookId: string, bookTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
            return;
        }

        setDeletingId(bookId);

        try {
            const result = await deleteBook(bookId);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "Book deleted successfully",
                });
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while deleting the book",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div className="w-full">
            {sortedBooks.length === 0 ? (
                <p className="text-light-500 py-4">No books found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-light-400">
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Book Title
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Author
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Genre
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Date Created
                                </th>
                                {isAdmin && (
                                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                        Action
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBooks.map((book) => (
                                <tr
                                    key={book.id}
                                    className="border-b border-light-400 hover:bg-light-300"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <BookCover
                                                variant="extraSmall"
                                                coverColor={book.coverColor || "#012B48"}
                                                coverImage={book.coverUrl}
                                            />
                                            <span className="text-sm font-medium text-dark-400 line-clamp-2">
                                                {book.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-dark-200">
                                        {book.author}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-dark-200">
                                        {book.genre}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-dark-200">
                                        {formatDate(book.createdAt)}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/admin/books/${book.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                        <path d="m15 5 4 4" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(book.id, book.title)}
                                                    disabled={deletingId === book.id}
                                                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M3 6h18" />
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookTable;
