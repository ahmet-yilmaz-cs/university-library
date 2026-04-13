import React from "react";
import Link from "next/link";
import {
  getDashboardStats,
  getRecentBorrowRequests,
  getPendingAccountRequests,
  getRecentlyAddedBooks,
} from "@/lib/admin/actions/dashboard";
import { checkIsAdmin } from "@/lib/admin/auth";
import BookCover from "@/components/BookCover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const Page = async () => {
  const isAdmin = await checkIsAdmin();
  const [statsResult, borrowResult, accountResult, booksResult] = await Promise.all([
    getDashboardStats(),
    getRecentBorrowRequests(5),
    getPendingAccountRequests(5),
    getRecentlyAddedBooks(6),
  ]);

  const stats = statsResult.success ? statsResult.data : { totalUsers: 0, totalBooks: 0, borrowedBooks: 0 };
  const borrowRequests = borrowResult.success ? borrowResult.data : [];
  const accountRequests = accountResult.success ? accountResult.data : [];
  const recentBooks = booksResult.success ? booksResult.data : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-6">
          <p className="text-sm text-slate-500">Borrowed Books</p>
          <p className="text-3xl font-bold text-dark-400 mt-2">{stats.borrowedBooks}</p>
        </div>
        <div className="rounded-xl bg-white p-6">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-3xl font-bold text-dark-400 mt-2">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl bg-white p-6">
          <p className="text-sm text-slate-500">Total Books</p>
          <p className="text-3xl font-bold text-dark-400 mt-2">{stats.totalBooks}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Borrow Requests */}
          <div className="rounded-xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-400">Borrow Requests</h3>
              <Link href="/admin/book-requests" className="text-sm text-primary-admin hover:underline">
                View all
              </Link>
            </div>
            {borrowRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                    <path d="M8 7h6"/>
                    <path d="M8 11h8"/>
                  </svg>
                </div>
                <h4 className="font-medium text-dark-400">No Pending Book Requests</h4>
                <p className="text-sm text-slate-500 mt-1">
                  There are no borrow book requests awaiting your review at this time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {borrowRequests.map((request: any) => (
                  <div key={request.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <BookCover
                      variant="extraSmall"
                      coverColor={request.book?.coverColor || "#012B48"}
                      coverImage={request.book?.coverUrl}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-400 truncate">{request.book?.title}</p>
                      <p className="text-xs text-slate-500">{request.user?.fullName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Requests */}
          <div className="rounded-xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-400">Account Requests</h3>
                <Link href="/admin/account-requests" className="text-sm text-primary-admin hover:underline">
                View all
              </Link>
            </div>
            {accountRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h4 className="font-medium text-dark-400">No Pending Account Requests</h4>
                <p className="text-sm text-slate-500 mt-1">
                  There are currently no account requests awaiting approval.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {accountRequests.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-amber-100 text-amber-900 text-sm">
                        {getInitials(user.fullName || "UN")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-400 truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Recently Added Books */}
        <div className="rounded-xl bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark-400">Recently Added Books</h3>
            <Link href="/admin/books" className="text-sm text-primary-admin hover:underline">
              View all
            </Link>
          </div>

          {/* Add New Book Button */}
          {isAdmin && (
            <Link
              href="/admin/books/new"
              className="flex items-center gap-3 p-3 mb-4 rounded-lg border-2 border-dashed border-slate-200 hover:border-primary-admin hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="M12 5v14"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-dark-400">Add New Book</span>
            </Link>
          )}

          {/* Books List */}
          <div className="space-y-3">
            {recentBooks.map((book: any) => (
              <div key={book.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <BookCover
                  variant="extraSmall"
                  coverColor={book.coverColor || "#012B48"}
                  coverImage={book.coverUrl}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-400 truncate">{book.title}</p>
                  <p className="text-xs text-slate-500">
                    By {book.author} • {book.genre}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                    </svg>
                    {formatDate(book.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
