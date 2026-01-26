import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="my-10 flex w-full justify-between items-center gap-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
        <span className="font-bebas-neue text-2xl text-white max-sm:hidden">BookWise</span>
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link href="/" className="text-light-100 hover:text-white transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link href="/search" className="text-light-100 hover:text-white transition-colors">
            Search
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
      </ul>
    </header>
  );
};

export default Header;



