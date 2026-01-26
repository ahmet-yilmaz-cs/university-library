import React from "react";
import BookForm from "@/components/admin/forms/BookForm";
import { getBookById } from "@/lib/admin/actions/book";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/admin/auth";

interface PageProps {
    params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
    // Sadece admin'ler kitap düzenleyebilir
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
        redirect("/admin/books");
    }

    const { id } = await params;
    const result = await getBookById(id);

    if (!result.success) {
        redirect("/admin/books");
    }

    return (
        <section className="w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">Edit Book</h2>
            <BookForm type="update" {...result.data} />
        </section>
    );
};

export default Page;
