"use client";

import React, { useState, useEffect, useRef } from "react";
import { updateUserRole, deleteUser } from "@/lib/admin/actions/user";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

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

interface UserTableProps {
    users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
    const router = useRouter();
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sortedUsers = [...users].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.fullName.localeCompare(b.fullName);
        } else {
            return b.fullName.localeCompare(a.fullName);
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

    const handleRoleChange = async (userId: string, newRole: "USER" | "ADMIN") => {
        setUpdatingRoleId(userId);
        setOpenDropdownId(null);

        try {
            const result = await updateUserRole(userId, newRole);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "User role updated successfully",
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
                description: "An error occurred while updating user role",
                variant: "destructive",
            });
        } finally {
            setUpdatingRoleId(null);
        }
    };

    const handleDelete = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete "${userName}"?`)) {
            return;
        }

        setDeletingId(userId);

        try {
            const result = await deleteUser(userId);

            if (result.success) {
                toast({
                    title: "Success",
                    description: "User deleted successfully",
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
                description: "An error occurred while deleting the user",
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
            {sortedUsers.length === 0 ? (
                <p className="text-light-500 py-4">No users found</p>
            ) : (
                <div className="overflow-visible relative">
                    <table className="min-w-full overflow-visible">
                        <thead>
                            <tr className="border-b border-light-400">
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Date Joined
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Books Borrowed
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    University ID No
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    University ID Card
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-light-400 hover:bg-light-300"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-amber-100 text-amber-900 text-sm font-medium">
                                                    {getInitials(user.fullName || "UN")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-dark-400">
                                                    {user.fullName}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-dark-200">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-4 py-3 overflow-visible">
                                        <div className="relative overflow-visible" ref={openDropdownId === user.id ? dropdownRef : null}>
                                            <button
                                                onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                                                disabled={updatingRoleId === user.id}
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                    user.role === "ADMIN"
                                                        ? "bg-[#E8F4FF] text-[#3B82F6]"
                                                        : "bg-[#FFF0F3] text-[#E45A6B]"
                                                } ${updatingRoleId === user.id ? "opacity-50" : "hover:opacity-80"}`}
                                            >
                                                {user.role === "ADMIN" ? "Admin" : "User"}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m6 9 6 6 6-6" />
                                                </svg>
                                            </button>

                                            {openDropdownId === user.id && (
                                                <div className="absolute left-0 top-full z-[9999] mt-1 w-32 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                                                    <button
                                                        onClick={() => handleRoleChange(user.id, "USER")}
                                                        className={`flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                                                            user.role === "USER" ? "text-[#E45A6B]" : "text-gray-700"
                                                        }`}
                                                    >
                                                        User
                                                        {user.role === "USER" && (
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
                                                                className="text-green-500"
                                                            >
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRoleChange(user.id, "ADMIN")}
                                                        className={`flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 ${
                                                            user.role === "ADMIN" ? "text-[#3B82F6]" : "text-gray-700"
                                                        }`}
                                                    >
                                                        Admin
                                                        {user.role === "ADMIN" && (
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
                                                                className="text-green-500"
                                                            >
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-dark-200 text-center">
                                        {user.borrowedBooks}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-dark-200">
                                        {user.universityId}
                                    </td>
                                    <td className="px-4 py-3">
                                        <a
                                            href={user.universityCard}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            View ID Card
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(user.id, user.fullName)}
                                            disabled={deletingId === user.id}
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserTable;
