"use client";

import React, { useState } from "react";
import { returnBook } from "@/lib/admin/actions/borrow";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import BookCover from "@/components/BookCover";

interface BorrowRecord {
  id: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    coverColor: string;
  } | null;
}

interface BorrowRequestsTableProps {
  records: BorrowRecord[];
  isAdmin: boolean;
}

const BorrowRequestsTable = ({ records, isAdmin }: BorrowRequestsTableProps) => {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "RETURNED") return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReturn = async (recordId: string, bookId: string, bookTitle: string) => {
    setProcessingId(recordId);

    try {
      const result = await returnBook(recordId, bookId);

      if (result.success) {
        toast({
          title: "Success",
          description: `"${bookTitle}" has been returned`,
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
        description: "An error occurred while processing the return",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-light-400">
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Book
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Borrow Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Status
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const overdue = isOverdue(record.dueDate, record.status);
              const daysRemaining = getDaysRemaining(record.dueDate);

              return (
                <tr
                  key={record.id}
                  className="border-b border-light-400 hover:bg-light-300"
                >
                  <td className="px-4 py-3">
                    {record.book ? (
                      <div className="flex items-center gap-3">
                        <BookCover
                          variant="extraSmall"
                          coverColor={record.book.coverColor || "#012B48"}
                          coverImage={record.book.coverUrl}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-dark-400 line-clamp-1">
                            {record.book.title}
                          </span>
                          <span className="text-xs text-slate-500">
                            {record.book.author}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Book deleted</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {record.user ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-amber-100 text-amber-900 text-xs font-medium">
                            {getInitials(record.user.fullName || "UN")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm text-dark-400">
                            {record.user.fullName}
                          </span>
                          <span className="text-xs text-slate-500">
                            {record.user.email}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">User deleted</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-200">
                    {formatDate(record.borrowDate)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-dark-200">
                        {formatDate(record.dueDate)}
                      </span>
                      {record.status === "BORROWED" && (
                        <span
                          className={`text-xs ${
                            overdue
                              ? "text-red-500"
                              : daysRemaining <= 3
                              ? "text-amber-500"
                              : "text-green-500"
                          }`}
                        >
                          {overdue
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : `${daysRemaining} days left`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {record.status === "BORROWED" ? (
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          overdue
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {overdue ? "Overdue" : "Borrowed"}
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                        Returned
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      {record.status === "BORROWED" && record.book && (
                        <button
                          onClick={() =>
                            handleReturn(record.id, record.book!.id, record.book!.title)
                          }
                          disabled={processingId === record.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary-admin px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-admin/90 transition-colors disabled:opacity-50"
                        >
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
                            <polyline points="9 10 4 15 9 20" />
                            <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                          </svg>
                          Return
                        </button>
                      )}
                      {record.status === "RETURNED" && (
                        <span className="text-sm text-slate-400">
                          {record.returnDate && formatDate(record.returnDate)}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowRequestsTable;
