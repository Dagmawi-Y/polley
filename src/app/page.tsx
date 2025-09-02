"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grain-bg">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center grain-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10"></div>
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                  Polls That{" "}
                  <span className="text-primary-themed bg-gradient-to-r from-primary-themed to-primary-themed/80 bg-clip-text text-transparent">
                    Matter
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-lg">
                  Gather opinions, make decisions, and engage your audience with beautifully designed polls that are easy to create and share.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary-themed hover:opacity-90 text-white shadow-2xl hover:shadow-primary-themed/25 transition-all duration-300 hover:scale-105 text-lg px-8 py-6">
                  <Link href="/polls/new">Create Your First Poll</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300 hover:scale-105 text-lg px-8 py-6">
                  <Link href="/polls">Browse Polls</Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="secondary" className="gap-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Free to use
                </Badge>
                <Badge variant="secondary" className="gap-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Real-time results
                </Badge>
                <Badge variant="secondary" className="gap-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  Easy sharing
                </Badge>
              </div>
            </div>
            
            <div className="relative lg:h-96">
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/hero-polls.svg"
                    alt="Poll visualization"
                    width={500}
                    height={375}
                    className="w-full max-w-lg mx-auto drop-shadow-2xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-themed/10 via-transparent to-primary-themed/10 rounded-2xl blur-3xl"></div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-10 left-10 w-4 h-4 bg-primary-themed/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-20 right-16 w-3 h-3 bg-primary-themed/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-20 left-20 w-2 h-2 bg-primary-themed/40 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-32 right-8 w-5 h-5 bg-primary-themed/25 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator at bottom of hero */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <button 
            onClick={() => {
              const featuresSection = document.getElementById('features-section');
              featuresSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-2 text-neutral-400 hover:text-primary-themed transition-colors duration-200 group"
          >
            <div className="animate-bounce group-hover:animate-pulse">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-neutral-50/50 dark:bg-neutral-900/50 grain-section">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Everything You Need to Create Great Polls
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              From simple yes/no questions to complex surveys, Polley has all the tools you need to gather meaningful feedback.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-primary-themed/20 hover:shadow-lg transition-shadow grain-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <Image
                    src="/feature-create.svg"
                    alt="Easy Creation"
                    width={64}
                    height={64}
                    className="w-full h-full"
                  />
                </div>
                <CardTitle>Easy Creation</CardTitle>
                <CardDescription>
                  Create polls in minutes with our intuitive interface. Add questions, options, and customize settings effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-primary-themed/20 hover:shadow-lg transition-shadow grain-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <Image
                    src="/feature-share.svg"
                    alt="Smart Sharing"
                    width={64}
                    height={64}
                    className="w-full h-full"
                  />
                </div>
                <CardTitle>Smart Sharing</CardTitle>
                <CardDescription>
                  Share your polls anywhere with custom links. Track engagement and reach your audience across all platforms.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-primary-themed/20 hover:shadow-lg transition-shadow grain-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <Image
                    src="/feature-analytics.svg"
                    alt="Real-time Analytics"
                    width={64}
                    height={64}
                    className="w-full h-full"
                  />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Watch results come in live with beautiful charts and detailed analytics. Export data for further analysis.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 grain-section">
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
      <section className="py-20 bg-gradient-to-r from-primary-themed/10 via-transparent to-primary-themed/10 grain-section">
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
