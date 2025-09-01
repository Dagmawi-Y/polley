import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur dark:bg-neutral-950/80">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold">
            Polley
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-300">
            <Link href="/polls">Polls</Link>
            <Link href="/polls/new">New Poll</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
