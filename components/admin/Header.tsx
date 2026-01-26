"use client";

import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = ({ session }: { session: Session }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Sayfa değiştiğinde veya URL parametresi değiştiğinde state'i güncelle
  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    setSearchQuery(currentQuery);
  }, [pathname, searchParams]);

  // Debounced search
  useEffect(() => {
    const currentUrlQuery = searchParams.get("query") || "";
    
    // Sadece kullanıcı input değiştirdiğinde URL'i güncelle
    if (searchQuery === currentUrlQuery) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.set("query", searchQuery);
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, pathname, router, searchParams]);

  return (
    <header className="admin-header">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-dark-400">
            Welcome, {session?.user?.name}
          </h2>
          <p className="text-base text-slate-500">
            Monitor all of your projects and tasks here
          </p>
        </div>
        <Link
          href="/"
          className="ml-4 flex items-center gap-2 rounded-lg bg-primary-admin px-4 py-2 text-white hover:bg-primary-admin/90 transition-colors"
        >
          <Image src="/icons/home.svg" alt="home" width={18} height={18} className="brightness-0 invert" />
          <span className="max-sm:hidden">Main Page</span>
        </Link>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-600 hover:bg-slate-50 transition-colors"
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
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span className="max-sm:hidden">Go Back</span>
        </button>
      </div>

      <div className="admin-search">
        <Image
          src="/icons/search-fill.svg"
          alt="search"
          width={20}
          height={20}
          className="opacity-50"
        />
        <input
          type="text"
          placeholder="Search users, books by title, author, or genre."
          className="admin-search_input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </header>
  );
};
export default Header;
