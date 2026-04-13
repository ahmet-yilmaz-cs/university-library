import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { signOut } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  session: Session | null;
}

const Header = ({ session }: HeaderProps) => {
  return (
    <header className="my-10 flex w-full justify-between items-center gap-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        <span className="font-bebas-neue text-2xl text-white max-sm:hidden">BookWise</span>
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link href="/search" className="text-light-100 hover:text-white transition-colors">
            Search
          </Link>
        </li>
        <li>
          <Link href="/admin" className="text-light-100 hover:text-white transition-colors">
            Admin Panel
          </Link>
        </li>

        {session ? (
          <>
            <li>
              <Link href="/my-profile" className="flex items-center">
                <Avatar className="h-10 w-10 border-2 border-primary hover:border-white transition-colors">
                  <AvatarFallback className="bg-primary text-dark-100 font-semibold">
                    {getInitials(session?.user?.name || "UN")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </li>
            <li>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button>Logout</Button>
              </form>
            </li>
          </>
        ) : (
          <li>
            <Link href="/sign-in">
              <Button className="bg-primary text-dark-100 hover:bg-primary/90 font-semibold px-6">
                Sign In
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;



