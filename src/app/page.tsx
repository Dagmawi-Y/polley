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
      <section className="relative grain-hero min-h-screen pt-16 sm:pt-20 lg:pt-24 pb-4 sm:pb-6 flex items-center">
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

        <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
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
          </div>
        </div>

        {/* Scroll indicator - positioned at bottom of screen */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
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
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="py-20 sm:py-28 lg:py-32 grain-section relative overflow-hidden"
      >
        {/* Enhanced background effects */}
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

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-themed/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-primary-themed/10 rounded-lg rotate-45 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-primary-themed/8 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Enhanced header with animation */}
          <div className="text-center space-y-4 sm:space-y-6 mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 border border-primary-themed/20 backdrop-blur-sm animate-fade-in">
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary-themed tracking-wide">Features</span>
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight animate-slide-up">
                Everything You Need to{" "}
                <span className="text-primary-themed bg-gradient-to-r from-primary-themed to-primary-themed/60 bg-clip-text text-transparent">
                  Create Great Polls
                </span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                From yes/no questions to multi-step surveys—design, share, and analyze with a polished, fast workflow.
              </p>
            </div>
          </div>

          {/* Interactive feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f, index) => (
              <div
                key={f.key}
                className="group relative animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Card with enhanced hover effects */}
                <div className="relative h-full p-6 sm:p-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">

                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Floating particles effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary-themed/30 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-primary-themed/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-primary-themed/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                  </div>

                  {/* Icon with enhanced animation */}
                  <div className="relative mb-6">
                    <div className="relative size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-primary-themed/20 to-primary-themed/10 ring-2 ring-primary-themed/20 group-hover:ring-primary-themed/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 flex items-center justify-center overflow-hidden">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/10 to-primary-themed/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Icon */}
                      <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={f.icon}
                          alt=""
                          width={32}
                          height={32}
                          className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-themed transition-colors duration-300 mb-2">
                        {f.title}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">
                        {f.description}
                      </p>
                    </div>

                    {/* Feature bullets with enhanced styling */}
                    <ul className="space-y-3 pt-2">
                      {f.bullets.map((b, bulletIndex) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-100 transition-colors duration-300"
                          style={{animationDelay: `${(index * 0.1) + (bulletIndex * 0.05)}s`}}
                        >
                          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-themed/10 text-primary-themed ring-1 ring-primary-themed/20 group-hover:bg-primary-themed group-hover:text-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-3 w-3"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.28 16.53a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 6.22-6.22a.75.75 0 1 1 1.06 1.06l-6.75 6.75Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-themed/0 via-primary-themed/5 to-primary-themed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-28 lg:py-32 grain-section relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-[1] dark:mix-blend-screen dark:opacity-40">
          <Noise
            patternSize={350}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={10}
            patternAlpha={18}
            useThemeColor={true}
            themeColorIntensity={0.06}
          />
        </div>

        {/* Animated connection lines */}
        <div className="absolute inset-0 pointer-events-none z-[2] hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path
              d="M200 200 Q400 150 600 200 Q800 250 1000 200"
              stroke="url(#gradient1)"
              strokeWidth="2"
              className="opacity-20"
              pathLength="1"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,1;1,0"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(var(--primary-color))" stopOpacity="0.3" />
                <stop offset="50%" stopColor="rgb(var(--primary-color))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="rgb(var(--primary-color))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Enhanced header */}
          <div className="text-center space-y-4 sm:space-y-6 mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 border border-primary-themed/20 backdrop-blur-sm animate-fade-in">
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary-themed tracking-wide">How It Works</span>
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight animate-slide-up">
                Create Amazing Polls in{" "}
                <span className="text-primary-themed bg-gradient-to-r from-primary-themed to-primary-themed/60 bg-clip-text text-transparent">
                  4 Simple Steps
                </span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                From idea to insights in minutes. Our intuitive process makes poll creation effortless.
              </p>
            </div>
          </div>

          {/* Interactive Process Steps */}
          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-themed/20 via-primary-themed/40 to-primary-themed/20 transform -translate-x-1/2"></div>

            <div className="space-y-12 lg:space-y-0">
              {[
                {
                  step: 1,
                  title: "Choose Your Question Type",
                  description: "Select from multiple question formats - single choice, multiple choice, rating scales, or open-ended questions.",
                  icon: "📝",
                  color: "from-blue-500 to-blue-600",
                  features: ["Multiple formats", "Custom validation", "Smart defaults"]
                },
                {
                  step: 2,
                  title: "Customize & Design",
                  description: "Make it your own with beautiful themes, custom colors, and branding that matches your style.",
                  icon: "🎨",
                  color: "from-purple-500 to-purple-600",
                  features: ["Brand colors", "Custom themes", "Responsive design"]
                },
                {
                  step: 3,
                  title: "Share & Collect Responses",
                  description: "Share your poll instantly via link, embed, or QR code. Watch responses flow in real-time.",
                  icon: "🚀",
                  color: "from-green-500 to-green-600",
                  features: ["One-click sharing", "Real-time results", "Multiple channels"]
                },
                {
                  step: 4,
                  title: "Analyze & Export Insights",
                  description: "Get beautiful charts, detailed analytics, and export-ready data to make informed decisions.",
                  icon: "📊",
                  color: "from-orange-500 to-orange-600",
                  features: ["Live analytics", "CSV export", "Advanced filters"]
                }
              ].map((step, index) => (
                <div
                  key={step.step}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 animate-slide-up ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  {/* Step Number & Icon */}
                  <div className="relative flex-shrink-0">
                    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl sm:text-3xl shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-6 group`}>
                      {/* Animated background */}
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Icon */}
                      <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </span>

                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping"></div>
                    </div>

                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-themed rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {step.step}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 max-w-lg ${index % 2 === 0 ? 'lg:text-left' : 'lg:text-right'}`}>
                    <div className="relative p-6 sm:p-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">

                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                      {/* Floating particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 right-4 w-2 h-2 bg-primary-themed/30 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                        <div className="absolute top-8 right-8 w-1 h-1 bg-primary-themed/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-primary-themed/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary-themed transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">
                          {step.description}
                        </p>

                        {/* Feature highlights */}
                        <div className="flex flex-wrap gap-2">
                          {step.features.map((feature, featureIndex) => (
                            <span
                              key={feature}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-themed/10 text-primary-themed rounded-full text-sm font-medium border border-primary-themed/20 group-hover:bg-primary-themed group-hover:text-white transition-all duration-300"
                              style={{animationDelay: `${(index * 0.2) + (featureIndex * 0.1)}s`}}
                            >
                              <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-themed/0 via-primary-themed/5 to-primary-themed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive CTA */}
          <div className="text-center mt-16 sm:mt-20 animate-slide-up" style={{animationDelay: '1s'}}>
            <div className="inline-flex items-center gap-4 p-8 bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 rounded-3xl border border-primary-themed/20 backdrop-blur-sm">
              <div className="text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Ready to Create Your First Poll?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Join thousands of users who trust Polley for their polling needs.
                </p>
                <Button asChild size="lg" className="bg-primary-themed hover:opacity-90 text-white shadow-2xl hover:shadow-primary-themed/25 transition-all duration-300 hover:scale-105 text-base px-8 py-3 rounded-xl">
                  <Link href="/polls/new">Start Creating Now</Link>
                </Button>
              </div>
              <div className="hidden sm:block">
                <div className="w-16 h-16 bg-primary-themed/20 rounded-2xl flex items-center justify-center animate-bounce">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 sm:py-28 lg:py-32 grain-section relative overflow-hidden">
        {/* Enhanced background effects */}
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

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-themed/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-themed/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary-themed/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Enhanced header */}
          <div className="text-center space-y-4 sm:space-y-6 mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 border border-primary-themed/20 backdrop-blur-sm animate-fade-in">
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary-themed tracking-wide">Our Impact</span>
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight animate-slide-up">
                Trusted by{" "}
                <span className="text-primary-themed bg-gradient-to-r from-primary-themed to-primary-themed/60 bg-clip-text text-transparent">
                  Thousands Worldwide
                </span>
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                Real numbers from real users making real decisions with Polley.
              </p>
            </div>
          </div>

          {/* Interactive Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                number: "10K+",
                label: "Polls Created",
                description: "Beautiful polls designed and shared",
                icon: "📊",
                color: "from-blue-500 to-blue-600",
                trend: "+23% this month"
              },
              {
                number: "50K+",
                label: "Votes Collected",
                description: "Responses gathered from engaged audiences",
                icon: "🎯",
                color: "from-green-500 to-green-600",
                trend: "+156% this month"
              },
              {
                number: "99%",
                label: "User Satisfaction",
                description: "Users love our intuitive experience",
                icon: "⭐",
                color: "from-purple-500 to-purple-600",
                trend: "Industry leading"
              }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="group relative animate-slide-up"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="relative h-full p-6 sm:p-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] overflow-hidden">

                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Floating particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary-themed/30 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                    <div className="absolute top-8 right-8 w-1 h-1 bg-primary-themed/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-primary-themed/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                  </div>

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`relative size-16 sm:size-20 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl sm:text-3xl shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      {/* Animated background */}
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Icon */}
                      <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </span>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div>
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-themed mb-2 group-hover:scale-105 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-themed transition-colors duration-300">
                        {stat.label}
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">
                        {stat.description}
                      </p>
                    </div>

                    {/* Trend indicator */}
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {stat.trend}
                      </span>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-themed/0 via-primary-themed/5 to-primary-themed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof indicators */}
          <div className="text-center mt-16 sm:mt-20 animate-slide-up" style={{animationDelay: '0.8s'}}>
            <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-themed to-primary-themed/60 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-xs font-bold text-white"
                    style={{animationDelay: `${i * 0.1}s`}}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Join 10,000+ creators</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300">Average 4.9★ rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="py-20 sm:py-28 lg:py-32 grain-section relative overflow-hidden">
        {/* Enhanced background effects */}
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

        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary-themed/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary-themed/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary-themed/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '6s'}}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none z-[3]">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary-themed/20 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Main CTA Content */}
            <div className="text-center space-y-8 sm:space-y-12">
              {/* Enhanced header */}
              <div className="space-y-6 animate-slide-up">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 border border-primary-themed/20 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-primary-themed tracking-wide">Get Started Today</span>
                  <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                  Ready to{" "}
                  <span className="text-primary-themed bg-gradient-to-r from-primary-themed to-primary-themed/60 bg-clip-text text-transparent">
                    Transform
                  </span>{" "}
                  Your Decision Making?
                </h2>

                <p className="text-xl sm:text-2xl lg:text-3xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed">
                  Join thousands of creators who trust Polley to gather meaningful insights and make better decisions.
                </p>
              </div>

              {/* Interactive CTA Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16">
                {/* Primary CTA Card */}
                <div className="group relative animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="relative p-8 sm:p-10 bg-gradient-to-br from-primary-themed to-primary-themed/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">

                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Floating elements */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                      <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                      <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-white/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                      <div className="text-6xl sm:text-7xl animate-bounce">🚀</div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                          Start Creating Now
                        </h3>
                        <p className="text-white/90 leading-relaxed mb-6">
                          Create your first poll in under 2 minutes. No credit card required.
                        </p>
                      </div>
                      <Button asChild size="lg" className="bg-white text-primary-themed hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-4 rounded-xl font-semibold">
                        <Link href="/polls/new">Create Your Poll</Link>
                      </Button>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>

                {/* Secondary CTA Card */}
                <div className="group relative animate-slide-up" style={{animationDelay: '0.5s'}}>
                  <div className="relative p-8 sm:p-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">

                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Floating elements */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-3 h-3 bg-primary-themed/30 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-8 right-8 w-2 h-2 bg-primary-themed/40 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                      <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-primary-themed/20 rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                      <div className="text-6xl sm:text-7xl animate-pulse">🔍</div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                          Explore Examples
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                          See what others are creating and get inspired for your next poll.
                        </p>
                      </div>
                      <Button asChild variant="secondary" size="lg" className="border-2 border-primary-themed text-primary-themed hover:bg-primary-themed hover:text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg px-8 py-4 rounded-xl font-semibold">
                        <Link href="/polls">Browse Polls</Link>
                      </Button>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-themed/0 via-primary-themed/5 to-primary-themed/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-12 sm:mt-16 animate-slide-up" style={{animationDelay: '0.8s'}}>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-800/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Free to start</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-800/50">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No setup required</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-800/50">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
