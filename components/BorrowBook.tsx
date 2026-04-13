"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

interface Props {
  userId?: string;
  bookId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
  isGuest?: boolean;
}

const BorrowBook = ({
  userId,
  bookId,
  borrowingEligibility: { isEligible, message },
  isGuest = false,
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  const handleBorrowBook = async () => {
    if (isGuest) {
      setShowGuestDialog(true);
      return;
    }

    if (!isEligible) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setBorrowing(true);

    try {
      const result = await borrowBook({ bookId, userId: userId! });

      if (result.success) {
        toast({
          title: "Success",
          description: "Book borrowed successfully",
        });

        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while borrowing the book",
        variant: "destructive",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <>
      <Button
        className="book-overview_btn"
        onClick={handleBorrowBook}
        disabled={borrowing}
      >
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
          {borrowing ? "Borrowing ..." : "Borrow Book"}
        </p>
      </Button>

      <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <DialogContent className="border-dark-100 bg-dark-300 text-white sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Image
                src="/icons/book.svg"
                alt="book"
                width={28}
                height={28}
                className="brightness-0 invert"
                style={{ filter: "invert(73%) sepia(74%) saturate(399%) hue-rotate(349deg) brightness(101%) contrast(97%)" }}
              />
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-white">
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-center text-base text-light-100">
              You need to sign in to borrow books from the library. Create an
              account or sign in to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-3">
            <Link href="/sign-in" className="w-full">
              <Button className="w-full min-h-12 bg-primary text-dark-100 font-semibold hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" className="w-full">
              <Button
                variant="outline"
                className="w-full min-h-12 border-dark-100 bg-transparent text-light-100 font-semibold hover:bg-dark-600 hover:text-white"
              >
                Create an Account
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default BorrowBook;
