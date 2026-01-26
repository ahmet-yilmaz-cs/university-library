import { Suspense } from "react";
import BookCard from "@/components/BookCard";
import Search from "@/components/Search";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, or, ilike } from "drizzle-orm";

interface Props {
    searchParams: Promise<{ query?: string }>;
}

const SearchPage = async ({ searchParams }: Props) => {
    const { query } = await searchParams;

    // Search books if query exists, otherwise get latest books
    const searchedBooks = query
        ? ((await db
            .select()
            .from(books)
            .where(
                or(
                    ilike(books.title, `%${query}%`),
                    ilike(books.author, `%${query}%`),
                    ilike(books.genre, `%${query}%`)
                )
            )
            .limit(20)
            .orderBy(desc(books.createdAt))) as Book[])
        : [];

    // Get latest books for when there's no search
    const latestBooks = !query
        ? ((await db
            .select()
            .from(books)
            .limit(12)
            .orderBy(desc(books.createdAt))) as Book[])
        : [];

    return (
        <div className="w-full">
            {/* Search Hero Section */}
            <section className="mx-auto flex max-w-xl w-full flex-col text-center mt-10">
                <p className="text-lg font-semibold uppercase text-light-100">Discover Your Next Great Read:</p>
                <h1 className="mt-2 text-3xl font-semibold text-white xs:text-5xl">
                    Explore and Search for <br />
                    <span className="text-primary">Any Book</span> In Our Library
                </h1>
                <Suspense fallback={<div className="relative mt-10 flex min-h-14 w-full items-center rounded-xl bg-dark-300 px-4 animate-pulse" />}>
                    <Search variant="large" />
                </Suspense>
            </section>

            {/* Search Results or Latest Books */}
            <section className="mt-16 w-full">
                {query ? (
                    <>
                        <h2 className="font-bebas-neue text-4xl text-light-100">
                            Search Results for &quot;{query}&quot;
                        </h2>
                        {searchedBooks.length > 0 ? (
                            <ul className="book-list">
                                {searchedBooks.map((book) => (
                                    <BookCard key={book.id} {...book} />
                                ))}
                            </ul>
                        ) : (
                            <div id="not-found" className="mt-10">
                                <div className="w-24 h-24 rounded-full bg-dark-300 flex items-center justify-center mx-auto">
                                    <img
                                        src="/icons/search-fill.svg"
                                        alt="No results"
                                        className="w-12 h-12 opacity-50"
                                    />
                                </div>
                                <h4>No Results Found</h4>
                                <p>We couldn&apos;t find any books matching your search. Try using different keywords or check for typos.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="font-bebas-neue text-4xl text-light-100">Latest Books</h2>
                        <ul className="book-list">
                            {latestBooks.map((book) => (
                                <BookCard key={book.id} {...book} />
                            ))}
                        </ul>
                    </>
                )}
            </section>
        </div>
    );
};

export default SearchPage;



