"use client";

import React, { useState } from "react";
import { updateUserStatus } from "@/lib/admin/actions/user";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import config from "@/lib/config";

interface PendingUser {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  status: string;
  createdAt: string;
}

interface AccountRequestsTableProps {
  users: PendingUser[];
}

const AccountRequestsTable = ({ users }: AccountRequestsTableProps) => {
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

  const handleApprove = async (userId: string, userName: string) => {
    setProcessingId(userId);

    try {
      const result = await updateUserStatus(userId, "APPROVED");

      if (result.success) {
        toast({
          title: "Success",
          description: `${userName} has been approved`,
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
        description: "An error occurred while approving the user",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to reject ${userName}'s request?`)) {
      return;
    }

    setProcessingId(userId);

    try {
      const result = await updateUserStatus(userId, "REJECTED");

      if (result.success) {
        toast({
          title: "Request Rejected",
          description: `${userName}'s request has been rejected`,
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
        description: "An error occurred while rejecting the user",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getUniversityCardUrl = (path: string) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    return `${config.env.imagekit.urlEndpoint}${path}`;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-light-400">
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Date Joined
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                University ID No
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                University ID Card
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-light-400 hover:bg-light-300"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-light-100 text-primary-admin text-sm font-medium">
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
                <td className="px-4 py-3 text-sm text-dark-200">
                  {user.universityId}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={getUniversityCardUrl(user.universityCard)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary-admin hover:text-primary-admin/80 transition-colors"
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
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    View ID Card
                  </a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(user.id, user.fullName)}
                      disabled={processingId === user.id}
                      className="rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      Approve Account
                    </button>
                    <button
                      onClick={() => handleReject(user.id, user.fullName)}
                      disabled={processingId === user.id}
                      className="flex items-center justify-center w-8 h-8 rounded-md bg-red-400/20 text-red-400 hover:bg-red-400/30 transition-colors disabled:opacity-50"
                    >
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
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountRequestsTable;
