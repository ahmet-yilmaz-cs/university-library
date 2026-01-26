import React from "react";
import { getAllBorrowRecords } from "@/lib/admin/actions/borrow";
import { checkIsAdmin } from "@/lib/admin/auth";
import BorrowRequestsTable from "@/components/admin/BorrowRequestsTable";

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

const Page = async () => {
  const isAdmin = await checkIsAdmin();
  const result = await getAllBorrowRecords();
  const borrowRecords: BorrowRecord[] = result.success ? result.data : [];

  // Separate borrowed and returned records
  const borrowedRecords = borrowRecords.filter((r) => r.status === "BORROWED");
  const returnedRecords = borrowRecords.filter((r) => r.status === "RETURNED");

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h2 className="text-xl font-semibold">Borrow Requests</h2>
        <div className="flex gap-4 text-sm">
          <span className="text-amber-600 font-medium">
            {borrowedRecords.length} Active
          </span>
          <span className="text-green-600 font-medium">
            {returnedRecords.length} Returned
          </span>
        </div>
      </div>

      {borrowRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-100 p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark-400">No borrow records</h3>
          <p className="text-slate-500 mt-1">
            Borrow requests will appear here when users borrow books
          </p>
        </div>
      ) : (
        <BorrowRequestsTable records={borrowRecords} isAdmin={isAdmin} />
      )}
    </section>
  );
};

export default Page;
