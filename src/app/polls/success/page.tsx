'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Noise } from '@/components/ui/noise';

export default function PollSuccessPage() {
  const searchParams = useSearchParams();
  const pollId = searchParams.get('id') || 'demo';
  const [copied, setCopied] = useState(false);
  
  const pollUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/polls/${pollId}`;
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/vote/${pollId}`;

  const copyToClipboard = async (text: string, type: 'link' | 'share') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="grain-bg min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-primary-themed/10 pointer-events-none" />
      <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-[1] dark:mix-blend-screen">
        <Noise
          patternSize={200}
          patternRefreshInterval={8}
          patternAlpha={15}
          useThemeColor={true}
          themeColorIntensity={0.1}
          className="dark:opacity-60"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Animation */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 animate-in zoom-in-75 duration-700 delay-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Celebration particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary-themed rounded-full animate-ping"
                  style={{
                    left: `${20 + (i * 12)}%`,
                    top: `${30 + (i % 2) * 20}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500 delay-300">
            <h1 className="text-4xl font-bold text-green-600">
              🎉 Poll Created Successfully!
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Your poll is now live and ready to collect responses. Share it with your audience to start gathering insights.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid gap-4 sm:grid-cols-2 animate-in slide-in-from-bottom-5 duration-500 delay-500">
            {/* Share Card */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Noise
                  patternSize={100}
                  patternAlpha={5}
                  useThemeColor={true}
                  themeColorIntensity={0.03}
                />
              </div>
              
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Share Your Poll</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <div className="text-xs text-neutral-500 mb-1">Voting Link</div>
                    <div className="text-sm font-mono break-all">{shareUrl}</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => copyToClipboard(shareUrl, 'share')}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Manage Card */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Noise
                  patternSize={100}
                  patternAlpha={5}
                  useThemeColor={true}
                  themeColorIntensity={0.03}
                />
              </div>
              
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Manage & Track</h3>
                </div>
                
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  View real-time results, edit settings, and analyze responses as they come in.
                </p>
                
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={pollUrl}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Poll
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500 delay-700">
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Active
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Public
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Real-time
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary-themed hover:opacity-90 text-white">
                <Link href="/polls/new">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Another Poll
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/polls">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View All Polls
                </Link>
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60 text-left animate-in slide-in-from-bottom-5 duration-500 delay-1000">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Pro Tips for Maximum Engagement
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-themed mt-2 shrink-0" />
                <span>Share on social media for wider reach</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-themed mt-2 shrink-0" />
                <span>Generate QR codes for offline sharing</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-themed mt-2 shrink-0" />
                <span>Monitor results in real-time</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-themed mt-2 shrink-0" />
                <span>Export data for further analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}