import React from "react";
import { getPendingUsers } from "@/lib/admin/actions/user";
import { checkIsAdmin } from "@/lib/admin/auth";
import { redirect } from "next/navigation";
import AccountRequestsTable from "@/components/admin/AccountRequestsTable";

interface PendingUser {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: string;
  createdAt: string;
}

const Page = async () => {
  // Sadece admin'ler bu sayfayı görebilir
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    redirect("/admin");
  }

  const result = await getPendingUsers();
  const pendingUsers: PendingUser[] = result.success ? result.data : [];

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h2 className="text-xl font-semibold text-dark-400">Account Registration Requests</h2>
        <button className="flex items-center gap-2 text-sm text-dark-400 hover:text-dark-500 transition-colors">
          <span>Oldest to Recent</span>
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
      </div>

      {pendingUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-light-100 p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#25388C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark-400">All caught up!</h3>
          <p className="text-slate-500 mt-1">No pending account requests</p>
        </div>
      ) : (
        <AccountRequestsTable users={pendingUsers} />
      )}
    </section>
  );
};

export default Page;
