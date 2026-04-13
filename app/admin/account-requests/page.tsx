import React from "react";
import { getPendingUsers } from "@/lib/admin/actions/user";
import { checkIsAdmin } from "@/lib/admin/auth";
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
  const isAdmin = await checkIsAdmin();
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
      ) : isAdmin ? (
        <AccountRequestsTable users={pendingUsers} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-light-400">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Date Joined</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">University ID No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id} className="border-b border-light-400 hover:bg-light-300">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-dark-400">{user.fullName}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-200">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-200">{user.universityId}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-600">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Page;
