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

  const [particles, setParticles] = useState<Array<{left: string; top: string; animationDelay: string; animationDuration: string}>>([]);

  const features = [
    {
      key: "create",
      title: "Effortless Creation",
      description: "Spin up polls in minutes with an intuitive interface.",
      icon: "/feature-create.svg",
    },
    {
      key: "share",
      title: "Share Anywhere",
      description: "Reach audiences with smart links and embeds.",
      icon: "/feature-share.svg",
    },
    {
      key: "analytics",
      title: "Live Analytics",
      description: "Watch results in real-time with export options.",
      icon: "/feature-analytics.svg",
    },
  ];

  // State for feature preview animation
  const [previewFeature, setPreviewFeature] = useState(features[0]);
  const [isFading, setIsFading] = useState(false);

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

  useEffect(() => {
    // Generate random particles only on client side to avoid hydration mismatch
    const generatedParticles = [...Array(12)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`
    }));
    setParticles(generatedParticles);
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
          patternAlpha={20}
          useThemeColor={true}
          themeColorIntensity={0.15}
          className="opacity-90 dark:opacity-40"
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
            patternAlpha={12}
            useThemeColor={true}
            themeColorIntensity={0.1}
            className="opacity-85 dark:opacity-30"
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
                  Gather opinions and make decisions with beautiful polls.
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

      {/* Redesigned Features Showcase Section */}
      <section
        id="features-section"
        className="py-20 sm:py-28 lg:py-32 grain-section relative overflow-hidden"
      >
        <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-[1] dark:mix-blend-screen dark:opacity-40">
          <Noise
            patternSize={300}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={8}
            patternAlpha={18}
            useThemeColor={true}
            themeColorIntensity={0.08}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 border border-primary-themed/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary-themed tracking-wide">Features</span>
            </div>

            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Polley Showcase —
              <span className="text-primary-themed bg-gradient-to-r from-primary-themed to-primary-themed/60 bg-clip-text text-transparent"> Interactive</span>
            </h2>
            <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Click or hover a feature to preview it.
            </p>
          </div>

          {/* Two-column interactive showcase: left = live preview, right = feature list/cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Live Preview Canvas */}
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-neutral-50 to-white/60 dark:from-neutral-900 dark:to-neutral-800/60 p-6 shadow-2xl backdrop-blur-md border border-neutral-200/40 dark:border-neutral-800/40 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs text-neutral-500">Live Preview</div>
                </div>

                <div className="rounded-2xl bg-gradient-to-b from-white/80 to-white/60 dark:from-neutral-800/70 dark:to-neutral-800/60 p-6 h-80 flex flex-col">
                  {/* Dynamic preview area updated by state */}
                  <div id="preview-canvas" className="flex-1 flex flex-col justify-center items-start gap-4">
                    {/* ...existing content replaced by stateful preview (rendered below) */}
                    <div className="w-full max-w-lg">
                      <div className="mb-4">
                        <div className={`text-sm text-neutral-500 transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>{previewFeature.description}</div>
                        <h3 className={`text-2xl font-bold text-neutral-900 dark:text-white transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>{previewFeature.title}</h3>
                      </div>

                      <div className="space-y-3" aria-live="polite">
                        {/* small interactive mock */}
                        <div className="bg-neutral-100 dark:bg-neutral-900/60 rounded-xl p-3 border border-neutral-200/40 dark:border-neutral-800/40">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-neutral-800 dark:text-white">Example question</div>
                            <div className="text-xs text-neutral-500">12 votes</div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-2">
                            <button className="w-full text-left px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200/40 dark:border-neutral-700 shadow-sm hover:shadow-md transition">Option A</button>
                            <button className="w-full text-left px-3 py-2 rounded-lg bg-white/50 dark:bg-neutral-800/40 border border-neutral-200/30 dark:border-neutral-700 shadow-sm hover:shadow-md transition">Option B</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">Interactive</Badge>
                      <div className="text-sm text-neutral-500">Preview updates on selection</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">Reset</Button>
                      <Button size="sm">Open Editor</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Feature cards list */}
            <div className="space-y-4">
              {features.map((f, idx) => (
                <article
                  key={f.key}
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => {
                    if (previewFeature.key !== f.key) {
                      setIsFading(true);
                      setTimeout(() => {
                        setPreviewFeature(f);
                        setIsFading(false);
                      }, 250);
                    }
                  }}
                  onFocus={() => {
                    if (previewFeature.key !== f.key) {
                      setIsFading(true);
                      setTimeout(() => {
                        setPreviewFeature(f);
                        setIsFading(false);
                      }, 250);
                    }
                  }}
                  onClick={() => {
                    if (previewFeature.key !== f.key) {
                      setIsFading(true);
                      setTimeout(() => {
                        setPreviewFeature(f);
                        setIsFading(false);
                      }, 250);
                    }
                    // programmatic selection: populate preview mock with details
                    const preview = document.getElementById('preview-canvas');
                    if (!preview) return;
                    // small visual pulse
                    preview.animate([{ transform: 'scale(0.995)' }, { transform: 'scale(1)' }], { duration: 180 });
                  }}
                  className="group relative p-4 sm:p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow hover:shadow-2xl transition-all duration-300 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary-themed/20 to-primary-themed/10 flex items-center justify-center ring-1 ring-primary-themed/20 group-hover:scale-105 transition-transform duration-300">
                      <Image src={f.icon} alt="" width={28} height={28} />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">{f.title}</h4>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{f.description}</p>
                    </div>

                    <div className="ml-3 hidden sm:flex items-center">
                      <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-themed transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Redesigned */}
      <section className="py-20 sm:py-28 lg:py-32 grain-section relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-[1] dark:mix-blend-screen dark:opacity-40">
          <Noise
            patternSize={350}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={10}
            patternAlpha={16}
            useThemeColor={true}
            themeColorIntensity={0.06}
          />
        </div>

        {/* Dynamic animated connection lines */}
        <div className="absolute inset-0 pointer-events-none z-[2] hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(var(--primary-color))" stopOpacity="0.1" />
                <stop offset="50%" stopColor="rgb(var(--primary-color))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgb(var(--primary-color))" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Flowing connection lines */}
            <path
              d="M200 150 Q400 120 600 180 Q800 240 1000 180"
              stroke="url(#flowGradient)"
              strokeWidth="3"
              className="opacity-30"
              pathLength="1"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,1;1,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M200 250 Q400 280 600 220 Q800 160 1000 220"
              stroke="url(#flowGradient)"
              strokeWidth="2"
              className="opacity-20"
              pathLength="1"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0,1;1,0"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Enhanced header with progress indicator */}
          <div className="text-center space-y-4 sm:space-y-6 mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 border border-primary-themed/20 backdrop-blur-sm animate-fade-in">
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary-themed tracking-wide">How It Works</span>
              <div className="w-2 h-2 bg-primary-themed rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight animate-slide-up">
                From Idea to{" "}
                <span className="text-primary-themed bg-gradient-to-r from-primary-themed to-primary-themed/60 bg-clip-text text-transparent">
                  Actionable Insights
                </span>{" "}
                in Minutes
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                Streamlined process for data-driven decisions.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mt-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      step === 1 ? 'bg-primary-themed scale-125' : 'bg-primary-themed/30'
                    }`} />
                    {step < 4 && (
                      <div className="w-8 h-0.5 bg-primary-themed/20 mx-1" />
                    )}
                  </div>
                ))}
              </div>
              <span className="text-sm text-neutral-500 ml-4">4 steps • ~5 minutes total</span>
            </div>
          </div>

          {/* Interactive Process Steps with Enhanced Design */}
          <div className="relative">
            {/* Desktop Timeline Line with Progress */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-themed/20 via-primary-themed/40 to-primary-themed/20 transform -translate-x-1/2 rounded-full">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-themed rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-8 lg:space-y-8">
              {[
                {
                  step: 1,
                  title: "Spark Your Question",
                  description: "Transform curiosity into compelling questions.",
                  icon: "�",
                  color: "from-amber-400 to-orange-500",
                  time: "~1 min",
                  features: ["Smart suggestions", "Question validation", "Audience targeting"],
                  preview: "Choose from templates or create custom questions that resonate with your audience."
                },
                {
                  step: 2,
                  title: "Design & Customize",
                  description: "Make polls visually stunning with tools.",
                  icon: "🎨",
                  color: "from-purple-500 to-pink-500",
                  time: "~2 min",
                  features: ["Brand integration", "Visual themes", "Mobile optimization"],
                  preview: "Apply your brand colors, add images, and choose from beautiful pre-designed themes."
                },
                {
                  step: 3,
                  title: "Launch & Share",
                  description: "Deploy instantly across channels.",
                  icon: "🚀",
                  color: "from-emerald-500 to-teal-500",
                  time: "~1 min",
                  features: ["Multi-platform sharing", "Real-time tracking", "Auto-responses"],
                  preview: "Share via link, embed in websites, or generate QR codes for instant distribution."
                },
                {
                  step: 4,
                  title: "Analyze & Act",
                  description: "Turn data into insights with analytics.",
                  icon: "�",
                  color: "from-blue-500 to-indigo-500",
                  time: "~1 min",
                  features: ["Advanced analytics", "Export options", "Trend analysis"],
                  preview: "View live results, export data, and uncover patterns that drive your decisions."
                }
              ].map((step, index) => (
                <div
                  key={step.step}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12 animate-slide-up group cursor-pointer ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  {/* Step Number & Icon with Enhanced Design */}
                  <div className="relative flex-shrink-0">
                    <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-xl sm:text-2xl shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl`}>
                      {/* Animated background layers */}
                      <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Icon with enhanced animation */}
                      <span className="relative z-10 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 drop-shadow-lg">
                        {step.icon}
                      </span>

                      {/* Pulse rings - only on hover */}
                      <div className={`absolute inset-0 rounded-3xl border-2 ${
                        step.step === 1 ? 'border-amber-400/60' :
                        step.step === 2 ? 'border-purple-500/60' :
                        step.step === 3 ? 'border-emerald-500/60' :
                        'border-blue-500/60'
                      } group-hover:animate-ping opacity-0 group-hover:opacity-100`}></div>
                      <div className={`absolute inset-0 rounded-3xl border ${
                        step.step === 1 ? 'border-amber-400/40' :
                        step.step === 2 ? 'border-purple-500/40' :
                        step.step === 3 ? 'border-emerald-500/40' :
                        'border-blue-500/40'
                      } group-hover:animate-ping opacity-0 group-hover:opacity-100`} style={{animationDelay: '0.5s'}}></div>
                    </div>

                    {/* Step number badge with time */}
                    <div className="absolute -top-2 -right-2 flex items-center gap-1">
                      <div className="w-7 h-7 bg-primary-themed rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {step.step}
                      </div>
                      <div className="px-1.5 py-0.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300 shadow-sm">
                        {step.time}
                      </div>
                    </div>

                    {/* Progress connector for mobile */}
                    {index < 3 && (
                      <div className="lg:hidden absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-primary-themed/40 to-transparent mt-4"></div>
                    )}
                  </div>

                  {/* Enhanced Content Card */}
                  <div className={`flex-1 max-w-lg ${index % 2 === 0 ? 'lg:text-left' : 'lg:text-right'}`}>
                    <div className="relative p-5 sm:p-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group-hover:border-primary-themed/30 overflow-hidden">

                      {/* Animated background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-primary-themed/5 via-transparent to-primary-themed/10' : 'from-primary-themed/10 via-transparent to-primary-themed/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>

                      {/* Floating particles with step-specific colors - only on hover */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-br ${step.color} rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-30`} style={{animationDelay: '0s'}}></div>
                        <div className={`absolute top-8 right-8 w-1 h-1 bg-gradient-to-br ${step.color} rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-40`} style={{animationDelay: '1s'}}></div>
                        <div className={`absolute bottom-6 left-6 w-1.5 h-1.5 bg-gradient-to-br ${step.color} rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-20`} style={{animationDelay: '2s'}}></div>
                        <div className={`absolute bottom-4 right-6 w-1 h-1 bg-gradient-to-br ${step.color} rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-50`} style={{animationDelay: '3s'}}></div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-themed transition-colors duration-300">
                            {step.title}
                          </h3>
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${step.color} group-hover:animate-pulse`}></div>
                        </div>

                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-300">
                          {step.description}
                        </p>
                      </div>

                      {/* Enhanced hover glow effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${index % 2 === 0 ? 'from-primary-themed/0 via-primary-themed/5 to-primary-themed/0' : 'from-primary-themed/0 via-primary-themed/5 to-primary-themed/0'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

                      {/* Subtle shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Interactive CTA with Progress Summary */}
          <div className="text-center mt-12 sm:mt-16 animate-slide-up" style={{animationDelay: '1s'}}>
            <div className="relative p-8 sm:p-10 bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 rounded-3xl border border-primary-themed/20 backdrop-blur-sm overflow-hidden">
              {/* Background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-themed/5 via-transparent to-primary-themed/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

              {/* Floating elements - only on hover */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary-themed/30 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-8 left-8 w-2 h-2 bg-primary-themed/40 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-6 right-6 w-2.5 h-2.5 bg-primary-themed/20 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '2s'}}></div>
              </div>

              <div className="relative z-10 text-center space-y-6">
                <div className="text-6xl animate-bounce">⚡</div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                    Ready to Create Your First Poll?
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6 max-w-2xl mx-auto">
                    Join thousands for meaningful insights.
                  </p>
                </div>

                {/* Progress summary */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-neutral-800/60 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">5 minutes setup</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-neutral-800/60 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Real-time results</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-neutral-800/60 rounded-xl">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Free forever</span>
                  </div>
                </div>

                <Button asChild size="lg" className="bg-primary-themed hover:opacity-90 text-white shadow-2xl hover:shadow-primary-themed/25 transition-all duration-300 hover:scale-105 text-lg px-8 py-4 rounded-xl font-semibold">
                  <Link href="/polls/new">Start Your Journey</Link>
                </Button>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
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
                Real numbers from real users.
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
      <section className="py-20 sm:py-28 lg:py-32 grain-section relative overflow-hidden group">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 mix-blend-soft-light pointer-events-none z-[1] dark:mix-blend-overlay dark:opacity-50">
          <Noise
            patternSize={180}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={4}
            patternAlpha={22}
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

        {/* Floating particles - only on hover */}
        <div className="absolute inset-0 pointer-events-none z-[3]">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary-themed/20 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100"
              style={particle}
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
                  Join thousands for meaningful insights.
                </p>
              </div>

              {/* Interactive CTA Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16">
                {/* Primary CTA Card */}
                <div className="group relative animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="relative p-8 sm:p-10 bg-gradient-to-br from-primary-themed to-primary-themed/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">

                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Floating elements - only on hover */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '0s'}}></div>
                      <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '1s'}}></div>
                      <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-white/20 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '2s'}}></div>
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                      <div className="text-6xl sm:text-7xl animate-bounce">🚀</div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                          Start Creating Now
                        </h3>
                        <p className="text-neutral-900 dark:text-white leading-relaxed mb-6">
                          Create your first poll in under 2 minutes.
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

                    {/* Floating elements - only on hover */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-3 h-3 bg-primary-themed/30 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-8 right-8 w-2 h-2 bg-primary-themed/40 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '1.5s'}}></div>
                      <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-primary-themed/20 rounded-full group-hover:animate-ping opacity-0 group-hover:opacity-100" style={{animationDelay: '2.5s'}}></div>
                    </div>

                    <div className="relative z-10 text-center space-y-6">
                      <div className="text-6xl sm:text-7xl animate-pulse">🔍</div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                          Explore Examples
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                          See what others are creating.
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
