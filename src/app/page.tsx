"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Noise } from "@/components/ui/noise";

export default function Home() {

  // Derive the current theme's primary color in RGB to build a dynamic gradient.
  const [primaryRgb, setPrimaryRgb] = useState<[number, number, number] | null>(null);


  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const tickingRef = useRef(false);

  useEffect(() => {
    // Create a temp element to read the computed color for the class `text-primary-themed`.
    const probe = document.createElement("span");
    probe.className = "text-primary-themed";
    probe.style.position = "absolute";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color; // e.g., rgb(34, 197, 94)
    document.body.removeChild(probe);

    const match = color.match(/rgb[a]?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (match) {
      setPrimaryRgb([
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        parseInt(match[3], 10),
      ]);
    } else {
      // Fallback to a pleasant green if parsing fails
      setPrimaryRgb([34, 197, 94]);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        // Fade the overlay as you scroll down; tune the distance as needed.
        const maxFadeDistance = 900; // px
        const y = window.scrollY;
        let next = 1 - y / maxFadeDistance;
        // Keep a whisper of color at the bottom for continuity.
        next = Math.max(0.08, Math.min(1, next));
        setOverlayOpacity(next);
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const gradientStyle = useMemo(() => {
    const [r, g, b] = primaryRgb ?? [34, 197, 94];
    // Vertical gradient: stronger at the top, easing to transparent.
    const stops = `linear-gradient(to bottom,
      rgba(${r}, ${g}, ${b}, 0.18) 0%,
      rgba(${r}, ${g}, ${b}, 0.12) 28%,
      rgba(${r}, ${g}, ${b}, 0.07) 58%,
      rgba(${r}, ${g}, ${b}, 0.03) 78%,
      rgba(${r}, ${g}, ${b}, 0.00) 100%)`;
    return {
      backgroundImage: stops,
      opacity: overlayOpacity,
    } as const;
  }, [primaryRgb, overlayOpacity]);



  const features = [
    {
      key: "create",
      title: "Effortless Creation",
      description:
        "Spin up beautiful polls in minutes with an interface that stays out of your way.",
      icon: "/feature-create.svg",
      bullets: [
        "Multiple question types",
        "Drafts and autosave",
        "Keyboard-first workflow",
      ],
    },
    {
      key: "share",
      title: "Share Anywhere",
      description:
        "Reach people where they are with smart links, embeds, and fine-grained access.",
      icon: "/feature-share.svg",
      bullets: [
        "One-click share links",
        "Embeds and QR codes",
        "Access controls",
      ],
    },
    {
      key: "analytics",
      title: "Live Analytics",
      description:
        "Watch results roll in with real-time charts and export-ready datasets.",
      icon: "/feature-analytics.svg",
      bullets: ["Real-time insights", "CSV export", "Anti-spam protections"],
    },
  ];
  return (
    <div className="grain-bg relative">
      {/* Global vertical primary gradient that fades on scroll */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={gradientStyle}
      />
      {/* Coarse grain texture overlay */}
      <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-[1] dark:mix-blend-screen">
        <Noise
          patternSize={200}
          patternScaleX={1}
          patternScaleY={1}
          patternRefreshInterval={5}
          patternAlpha={35}
          useThemeColor={true}
          themeColorIntensity={0.15}
          className="dark:opacity-60"
        />
      </div>
      {/* Hero Section */}
      <section className="relative grain-hero pt-16 sm:pt-20 lg:pt-24 pb-4 sm:pb-6">
        {/* Simplified background */}
        <div className="absolute inset-0 mix-blend-soft-light pointer-events-none z-[1] dark:mix-blend-overlay">
          <Noise
            patternSize={120}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={4}
            patternAlpha={15}
            useThemeColor={true}
            themeColorIntensity={0.1}
            className="dark:opacity-40"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-3 sm:space-y-4">
              {/* Main content */}
              <div className="space-y-3 sm:space-y-4">
                {/* Modern brand badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 border border-primary-themed/20 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-themed animate-pulse"></div>
                  <span className="text-sm font-medium text-primary-themed">
                    Introducing Polley
                  </span>
                  <svg className="w-3 h-3 text-primary-themed/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                  Polls That{" "}
                  <span className="text-primary-themed bg-gradient-to-r from-primary-themed to-primary-themed/60 bg-clip-text text-transparent">
                    Matter
                  </span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto px-4">
                  Gather opinions, make decisions, and engage your audience with beautifully designed polls that are easy to create and share.
                </p>
              </div>

              {/* CTA Buttons - centered */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button asChild size="lg" className="bg-primary-themed hover:opacity-90 text-white shadow-2xl hover:shadow-primary-themed/25 transition-all duration-300 hover:scale-105 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-xl">
                  <Link href="/polls/new">Create Your First Poll</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="border-2 border-primary-themed/20 hover:bg-primary-themed/5 transition-all duration-300 hover:scale-105 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-xl">
                  <Link href="/polls">Browse Polls</Link>
                </Button>
              </div>

              {/* Trust indicators - simpler */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm px-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Free to use</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Real-time results</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Easy sharing</span>
                </div>
              </div>
            </div>

            {/* Beautiful hero illustration - responsive sizing with reduced gap */}
            <div className="flex justify-center mt-3 sm:mt-4 lg:mt-6 px-4">
              <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg">
                <div className="relative group">
                  <Image
                    src="/hero-modern-poll.svg"
                    alt="Beautiful poll interface showing a seasonal preference survey with animated results"
                    width={600}
                    height={400}
                    className="w-full h-auto drop-shadow-xl sm:drop-shadow-2xl transition-all duration-500 hover:scale-105 hover:drop-shadow-3xl"
                    priority
                  />
                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  {/* Subtle border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-amber-500/20 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>

            {/* Scroll indicator - more compact and always visible */}
            <div className="flex justify-center mt-4 sm:mt-6 pb-2 sm:pb-4">
              <button
                onClick={() => {
                  const featuresSection = document.getElementById('features-section');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center gap-1 sm:gap-2 text-neutral-400 hover:text-primary-themed transition-all duration-300 hover:scale-110 group"
              >
                <span className="text-xs sm:text-sm font-medium tracking-wide">Discover more</span>
                <div className="animate-bounce group-hover:animate-pulse">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="py-16 sm:py-20 lg:py-24 grain-section relative"
      >
        {/* Subtle noise for features section */}
        <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-[1] dark:mix-blend-screen dark:opacity-40">
          <Noise
            patternSize={300}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={8}
            patternAlpha={20}
            useThemeColor={true}
            themeColorIntensity={0.08}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14">
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="bg-primary-themed/10 text-primary-themed border-primary-themed/20">
                Features
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight px-4">
              Everything You Need to Create Great Polls
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto px-4">
              From yes/no questions to multi-step surveys—design, share, and analyze with a polished, fast workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f) => (
              <Card
                key={f.key}
                className="group relative overflow-hidden border-neutral-200/50 dark:border-neutral-800/60 bg-white/60 dark:bg-neutral-900/60 supports-[backdrop-filter]:backdrop-blur rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)]"
              >
                {/* soft gradient wash */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-themed/0 via-primary-themed/0 to-primary-themed/10 opacity-70" />
                {/* top accent line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-themed/40 to-transparent" />

                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative size-12 shrink-0 rounded-xl bg-primary-themed/10 ring-1 ring-primary-themed/20 grid place-items-center">
                      <Image
                        src={f.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="opacity-90"
                      />
                    </div>
                    <div>
                      <CardTitle className="leading-tight">
                        {f.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {f.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="mt-4 space-y-3">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary-themed/10 text-primary-themed ring-1 ring-primary-themed/20">
                          {/* check icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.28 16.53a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 6.22-6.22a.75.75 0 1 1 1.06 1.06l-6.75 6.75Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 grain-section relative">
        {/* Stats noise effect */}
        <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-[1] dark:mix-blend-screen dark:opacity-30">
          <Noise
            patternSize={250}
            patternScaleX={0.8}
            patternScaleY={1.2}
            patternRefreshInterval={6}
            patternAlpha={15}
            useThemeColor={true}
            themeColorIntensity={0.12}
          />
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-primary-themed">10K+</div>
              <div className="text-neutral-600 dark:text-neutral-300">Polls Created</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-primary-themed">50K+</div>
              <div className="text-neutral-600 dark:text-neutral-300">Votes Collected</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold text-primary-themed">99%</div>
              <div className="text-neutral-600 dark:text-neutral-300">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 grain-section relative">
        {/* Themed noise for CTA section */}
        <div className="absolute inset-0 mix-blend-soft-light pointer-events-none z-[1] dark:mix-blend-overlay dark:opacity-50">
          <Noise
            patternSize={180}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={4}
            patternAlpha={25}
            useThemeColor={true}
            themeColorIntensity={0.25}
          />
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Collecting Opinions?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              Join thousands of users who trust Polley to gather meaningful feedback and make better decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary-themed hover:opacity-90 text-white">
                <Link href="/auth/sign-up">Get Started Free</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/polls">View Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
