"use client";

import { Session } from "next-auth";
import Image from "next/image";
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
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          Welcome, {session?.user?.name}
        </h2>
        <p className="text-base text-slate-500">
          Monitor all of your projects and tasks here
        </p>
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
