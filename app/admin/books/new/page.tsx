import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookForm from "@/components/admin/forms/BookForm";
import { checkIsAdmin } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  // Sadece admin'ler yeni kitap ekleyebilir
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    redirect("/admin/books");
  }

  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <BookForm />
      </section>
    </>
  );
};
export default Page;
