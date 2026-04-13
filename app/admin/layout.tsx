import React, { ReactNode, Suspense } from "react";
import { auth } from "@/auth";

import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { AdminProvider } from "@/context/AdminContext";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  let isAdmin = false;

  if (session?.user?.id) {
    const result = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    isAdmin = result[0]?.role === "ADMIN";
  }

  return (
    <AdminProvider isAdmin={isAdmin}>
      <main className="flex min-h-screen w-full flex-row">
        <Sidebar session={session} isAdmin={isAdmin} />

        <div className="admin-container">
          {!isAdmin && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-5 py-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d97706"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm font-medium text-amber-800">
                View-only mode — You can browse the admin panel, but you cannot make any changes.
              </p>
            </div>
          )}

          <Suspense fallback={<div className="admin-header" />}>
            <Header session={session} />
          </Suspense>
          {children}
        </div>
      </main>
    </AdminProvider>
  );
};
export default Layout;
