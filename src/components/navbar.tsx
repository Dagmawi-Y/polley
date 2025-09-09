"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Plus,
  Sparkles,
  ChevronRight,
  LogIn,
  UserPlus,
  Eye,
  LogOut,
  Zap
} from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollPosition = window.scrollY;

      // Handle navbar visibility (always show, but compact at top)
      setIsVisible(true);
      lastScrollY.current = currentScrollY;

      // Handle background change
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarClasses = `fixed top-0 z-50 w-full transition-all duration-500 ease-out ${
    isVisible
      ? "translate-y-0"
      : "-translate-y-full"
  } ${
    isScrolled || !isHomePage
      ? "backdrop-blur-xl border-b border-neutral-200/20 dark:border-neutral-800/20"
      : "backdrop-blur-md bg-white/5 dark:bg-neutral-900/5"
  }`;

  // Show minimal navbar at top of homepage
  const isMinimalNavbar = isHomePage && !isScrolled;

  const navItemClasses = (isActive: boolean) =>
    `group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
      isActive
        ? "bg-gradient-to-r from-primary-themed/10 to-primary-themed/5 text-primary-themed shadow-lg shadow-primary-themed/10"
        : "text-neutral-600 hover:text-primary-themed dark:text-neutral-400 dark:hover:text-primary-themed"
    } hover:scale-105 hover:shadow-lg hover:shadow-primary-themed/20 hover:bg-white/50 dark:hover:bg-neutral-800/50 transform-gpu`;

  const glowEffect = "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-primary-themed/20 before:via-transparent before:to-primary-themed/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100";

  return (
    <>
      <header className={navbarClasses}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Logo and Navigation (hidden at top of homepage) */}
            {!isMinimalNavbar && (
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <Link href="/" className="group flex items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-themed/30 to-primary-themed/50 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                      <Image
                        src="/polley-logo.svg"
                        alt="Polley Logo"
                        width={40}
                        height={40}
                        className="object-contain relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                        priority
                      />
                    </div>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2" role="navigation" aria-label="Primary navigation">
                  <div className="flex items-center gap-1 animate-stagger-in">
                    <Link
                      href="/polls"
                      className={`${navItemClasses(pathname === "/polls")} ${glowEffect} nav-link-focus group hover:-rotate-1 focus:outline-none`}
                      aria-current={pathname === "/polls" ? "page" : undefined}
                    >
                      <Eye className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                      <span>Browse Polls</span>
                      <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" aria-hidden="true" />
                    </Link>
                    <Link
                      href="/polls/new"
                      className={`${navItemClasses(pathname === "/polls/new")} ${glowEffect} nav-link-focus group hover:rotate-1 focus:outline-none`}
                      aria-current={pathname === "/polls/new" ? "page" : undefined}
                    >
                      <Plus className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90" aria-hidden="true" />
                      <span>Create Poll</span>
                      <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12" aria-hidden="true" />
                    </Link>
                  </div>
                </nav>
              </div>
            )}

            {/* Spacer when minimal navbar */}
            {isMinimalNavbar && <div className="flex-1" />}

            {/* Right side - Actions */}
            {isMinimalNavbar ? (
              /* Minimal navbar - Only ThemeSwitcher */
              <div className="flex items-center">
                <ThemeSwitcher />
              </div>
            ) : (
              /* Full navbar - All elements */
              <div className="flex items-center gap-4">
                {/* Theme Switcher - Always visible */}
                <ThemeSwitcher />

                {/* Auth Section */}
                {user ? (
                  <div className="flex items-center gap-3 animate-fadeIn">
                    <div className="hidden sm:flex items-center gap-2">
                      <Avatar className="h-8 w-8 ring-2 ring-primary-themed/20 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 transition-all duration-300 hover:ring-primary-themed/40">
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
                      className="text-sm hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 animate-fadeIn">
                    <Button asChild variant="ghost" className="text-sm font-medium group hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-themed/50 focus:ring-offset-2">
                      <Link href="/auth/sign-in" className="flex items-center gap-2" aria-label="Sign in to your account">
                        <LogIn className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild className="bg-primary-themed hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:shadow-primary-themed/30 transition-all duration-300 hover:scale-105 btn-shimmer group focus:outline-none focus:ring-2 focus:ring-primary-themed/50 focus:ring-offset-2">
                          <Link href="/auth/sign-up" className="flex items-center gap-2" aria-label="Sign up for a new account">
                            <UserPlus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
                            Sign up
                            <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125" aria-hidden="true" />
                          </Link>
                        </Button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button (hidden in minimal navbar) */}
            {!isMinimalNavbar && (
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-themed/50 focus:ring-offset-2"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-navigation"
                  aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 transition-transform duration-300 rotate-90" aria-hidden="true" />
                  ) : (
                    <Menu className="w-5 h-5 transition-transform duration-300" aria-hidden="true" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Menu (hidden in minimal navbar) */}
          {isMobileMenuOpen && !isMinimalNavbar && (
            <div
              id="mobile-navigation"
              className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border-b border-primary-themed/20 animate-slideDown"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <nav className="px-4 py-4 space-y-2">
                <Link
                  href="/polls"
                  className="flex items-center justify-between p-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-primary-themed/10 hover:text-primary-themed transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-themed/50 focus:ring-inset"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={pathname === "/polls" ? "page" : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5" aria-hidden="true" />
                    <span>Browse Polls</span>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/polls/new"
                  className="flex items-center justify-between p-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-primary-themed/10 hover:text-primary-themed transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-themed/50 focus:ring-inset"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={pathname === "/polls/new" ? "page" : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Plus className="w-5 h-5" aria-hidden="true" />
                    <span>Create Poll</span>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stagger-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-stagger-in { animation: stagger-in 0.6s ease-out; }
        .glow-effect:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </>
  );
}
