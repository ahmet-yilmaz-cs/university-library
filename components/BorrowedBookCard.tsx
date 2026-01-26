"use client";

import React, { useState } from "react";
import Link from "next/link";
import BookCover from "./BookCover";
import { Button } from "./ui/button";
import { returnOwnBook } from "@/lib/actions/book";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

interface BorrowedBookCardProps {
  record: BorrowedBook;
}

const BorrowedBookCard = ({ record }: BorrowedBookCardProps) => {
  const router = useRouter();
  const [isReturning, setIsReturning] = useState(false);

  if (!record.book) return null;

  const isOverdue = new Date(record.dueDate) < new Date() && record.status === "BORROWED";
  const daysRemaining = Math.ceil(
    (new Date(record.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReturn = async () => {
    if (!confirm(`Are you sure you want to return "${record.book?.title}"?`)) {
      return;
    }

    setIsReturning(true);

    try {
      const result = await returnOwnBook(record.id);

      if (result.success) {
        toast({
          title: "Success",
          description: "Book returned successfully!",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to return book",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while returning the book",
        variant: "destructive",
      });
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-dark-300 border border-dark-600">
      <Link href={`/books/${record.book.id}`} className="shrink-0">
        <BookCover
          variant="small"
          coverColor={record.book.coverColor}
          coverImage={record.book.coverUrl}
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/books/${record.book.id}`}>
            <h3 className="text-lg font-semibold text-white hover:text-primary transition-colors">
              {record.book.title}
            </h3>
          </Link>
          <p className="text-light-100 text-sm mt-1">By {record.book.author}</p>
          <p className="text-light-500 text-xs mt-1">{record.book.genre}</p>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-light-100">
            <span>Borrowed: {formatDate(record.borrowDate)}</span>
            <span>Due: {formatDate(record.dueDate)}</span>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            {record.status === "BORROWED" ? (
              <>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    isOverdue
                      ? "bg-red-500/20 text-red-400"
                      : daysRemaining <= 2
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysRemaining)} days`
                    : `${daysRemaining} days remaining`}
                </span>

                <Button
                  onClick={handleReturn}
                  disabled={isReturning}
                  size="sm"
                  className="bg-primary text-dark-100 hover:bg-primary/90 text-xs"
                >
                  {isReturning ? "Returning..." : "Return Book"}
                </Button>
              </>
            ) : (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-light-500/20 text-light-500">
                Returned
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBookCard;
