"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-neutral-200/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800/20 dark:bg-neutral-950/80 dark:supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <Image
                src="/polley-logo.png"
                alt="Polley Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-themed transition-colors">
              Polley
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/polls" 
              className="text-sm font-medium text-neutral-600 hover:text-primary-themed dark:text-neutral-400 dark:hover:text-primary-themed transition-all duration-200 hover:scale-105"
            >
              Browse Polls
            </Link>
            <Link 
              href="/polls/new" 
              className="text-sm font-medium text-neutral-600 hover:text-primary-themed dark:text-neutral-400 dark:hover:text-primary-themed transition-all duration-200 hover:scale-105"
            >
              Create Poll
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-themed/20 to-primary-themed/40 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-themed">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">
                  {user.email}
                </span>
              </div>
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-all duration-200"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
              <Button asChild className="bg-primary-themed hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
