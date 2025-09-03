"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navbarClasses = isHomePage 
    ? `fixed top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled 
          ? "translate-y-0 border-b border-neutral-200/30 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-neutral-800/30 dark:bg-neutral-900/95 dark:supports-[backdrop-filter]:bg-neutral-900/80 shadow-lg" 
          : "-translate-y-full"
      }`
    : "fixed top-0 z-50 w-full border-b border-neutral-200/30 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-neutral-800/30 dark:bg-neutral-900/95 dark:supports-[backdrop-filter]:bg-neutral-900/80";

  return (
    <>
      {/* Always visible logo on homepage - only when not scrolled */}
      {isHomePage && !isScrolled && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <Link href="/" className="group flex items-center">
            <Image
              src="/polley-logo.png"
              alt="Polley Logo"
              width={70}
              height={70}
              className="object-contain transition-all duration-200 group-hover:scale-105"
              priority
            />
            <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-themed transition-colors">
              Polley
            </span>
          </Link>
        </div>
      )}

      <header className={navbarClasses}>
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Left side - Navigation (hidden on mobile, shown on desktop) */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
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

          {/* Center - Logo and Brand (visible when scrolled on homepage OR always on other pages) */}
          {(!isHomePage || isScrolled) && (
            <div className="flex items-center justify-center flex-1 md:flex-initial">
              <Link href="/" className="group flex items-center gap-3">
                <Image
                  src="/polley-logo.png"
                  alt="Polley Logo"
                  width={48}
                  height={48}
                  className="object-contain transition-all duration-200 group-hover:scale-105"
                  priority
                />
                <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-themed transition-colors">
                  Polley
                </span>
              </Link>
            </div>
          )}

        {/* Right side - Theme switcher and Auth */}
        <div className={`flex items-center gap-4 ${(!isHomePage || isScrolled) ? 'flex-1 justify-end' : 'ml-auto'}`}>
          {/* Only show theme switcher when not on home page or when scrolled */}
          {(!isHomePage || isScrolled) && <ThemeSwitcher />}
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-primary-themed/20 to-primary-themed/40 text-primary-themed text-xs font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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

        {/* Mobile Navigation Menu - if needed */}
        <div className="md:hidden absolute left-4">
          <nav className="flex items-center gap-4">
            <Link 
              href="/polls" 
              className="text-xs font-medium text-neutral-600 hover:text-primary-themed dark:text-neutral-400 dark:hover:text-primary-themed transition-all duration-200"
            >
              Polls
            </Link>
            <Link 
              href="/polls/new" 
              className="text-xs font-medium text-neutral-600 hover:text-primary-themed dark:text-neutral-400 dark:hover:text-primary-themed transition-all duration-200"
            >
              Create
            </Link>
          </nav>
        </div>
      </div>
    </header>
    </>
  );
}
