import React from "react";
import { getAllUsers } from "@/lib/admin/actions/user";
import UserTable from "@/components/admin/UserTable";

interface User {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string;
    status: string;
    role: string;
    borrowedBooks: number;
    createdAt: string;
}

interface PageProps {
    searchParams: Promise<{ query?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
    const { query } = await searchParams;
    const result = await getAllUsers();
    const allUsers: User[] = result.success ? result.data : [];

    // Arama filtrelemesi
    const users = query
        ? allUsers.filter((user: User) => {
            const searchQuery = query.toLowerCase();
            return (
                user.fullName.toLowerCase().includes(searchQuery) ||
                user.email.toLowerCase().includes(searchQuery) ||
                user.universityId.toString().includes(searchQuery)
            );
        })
        : allUsers;

    return (
        <section className="w-full rounded-2xl bg-white p-7 overflow-visible">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">All Users</h2>
                <button className="flex items-center gap-2 text-sm text-dark-400 hover:text-dark-500 transition-colors">
                    <span>A-Z</span>
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

            <div className="mt-7">
                <UserTable users={users} />
            </div>
        </section>
    );
};

export default Page;
