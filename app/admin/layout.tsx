import React, { ReactNode, Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { AdminProvider } from "@/context/AdminContext";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const result = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const isAdmin = result[0]?.role === "ADMIN";

  return (
    <AdminProvider isAdmin={isAdmin}>
      <main className="flex min-h-screen w-full flex-row">
        <Sidebar session={session} isAdmin={isAdmin} />

        <div className="admin-container">
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
