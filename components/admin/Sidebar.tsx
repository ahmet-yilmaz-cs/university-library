"use client";

import Image from "next/image";
import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

const adminOnlyRoutes: string[] = [];

interface SidebarProps {
  session: Session | null;
  isAdmin: boolean;
}

const Sidebar = ({ session, isAdmin }: SidebarProps) => {
  const pathname = usePathname();

  const visibleLinks = isAdmin
    ? adminSideBarLinks
    : adminSideBarLinks.filter((link) => !adminOnlyRoutes.includes(link.route));

  return (
    <div className="admin-sidebar">
      <div>
        <div className="logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo"
            height={37}
            width={37}
          />
          <h1>BookWise</h1>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {visibleLinks.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "link",
                    isSelected && "bg-primary-admin shadow-sm",
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt="icon"
                      fill
                      className={`${isSelected ? "brightness-0 invert" : ""}  object-contain`}
                    />
                  </div>

                  <p className={cn(isSelected ? "text-white" : "text-dark")}>
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {session ? (
          <>
            <div className="user flex-1">
              <Avatar>
                <AvatarFallback className="bg-amber-100">
                  {getInitials(session?.user?.name || "IN")}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col max-md:hidden">
                <p className="font-semibold text-dark-200">{session?.user?.name}</p>
                <p className="text-xs text-light-500">{session?.user?.email}</p>
              </div>
            </div>

            <button 
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors max-md:hidden"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="user flex-1 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Avatar>
              <AvatarFallback className="bg-slate-200 text-slate-600">
                G
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col max-md:hidden">
              <p className="font-semibold text-dark-200">Guest</p>
              <p className="text-xs text-primary-admin">Sign in</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
