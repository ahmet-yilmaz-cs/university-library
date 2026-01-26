"use client";

import React, { useState, useCallback, useTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

interface Props {
    placeholder?: string;
    variant?: "small" | "large";
}

const Search = ({
    placeholder = "Search books by title, author or genre...",
    variant = "small"
}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("query") || "";
    const [query, setQuery] = useState(initialQuery);
    const [isPending, startTransition] = useTransition();

    const handleSearch = useCallback((value: string) => {
        startTransition(() => {
            const params = new URLSearchParams();

            if (value.trim()) {
                params.set("query", value);
                router.replace(`/search?${params.toString()}`, { scroll: false });
            } else if (pathname === "/search") {
                router.replace("/search", { scroll: false });
            }
        });
    }, [router, pathname]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        // Debounce the search
        const timeoutId = setTimeout(() => {
            handleSearch(value);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(query);
        }
    };

    // Large variant for search page
    if (variant === "large") {
        return (
            <div className="search">
                <Image
                    src="/icons/search-fill.svg"
                    alt="search"
                    width={21}
                    height={21}
                    className="cursor-pointer"
                />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="search-input"
                />
            </div>
        );
    }

    // Small variant for header
    return (
        <div className="flex items-center gap-2 rounded-lg bg-dark-300 px-3 py-2 min-w-[180px] max-w-[280px]">
            <Image
                src="/icons/search-fill.svg"
                alt="search"
                width={18}
                height={18}
                className="cursor-pointer opacity-70"
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="border-none bg-transparent text-sm text-white placeholder:text-light-100 focus-visible:ring-0 focus-visible:shadow-none h-8 p-0"
            />
        </div>
    );
};

export default Search;


