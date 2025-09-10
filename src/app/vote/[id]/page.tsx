'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PollCard, type Poll } from '@/components/poll-card';
import { Noise } from '@/components/ui/noise';

// Mock poll data - same as in the individual poll page
const mockPolls: Record<string, Poll> = {
  '1': {
    id: '1',
    title: 'What\'s your favorite season?',
    description: 'Help us understand seasonal preferences for our upcoming product launch.',
    options: [
      { id: '1a', text: 'Spring - Fresh starts and blooming flowers', votes: 45 },
      { id: '1b', text: 'Summer - Warm weather and long days', votes: 78 },
      { id: '1c', text: 'Fall - Cozy vibes and beautiful colors', votes: 62 },
      { id: '1d', text: 'Winter - Snow and holiday magic', votes: 23 }
    ],
    totalVotes: 208,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-02-15'),
    isPublic: true
  },
  '2': {
    id: '2',
    title: 'Best programming language for beginners?',
    description: 'Share your thoughts on which language newcomers should learn first.',
    options: [
      { id: '2a', text: 'Python - Simple syntax and versatile', votes: 156 },
      { id: '2b', text: 'JavaScript - Essential for web development', votes: 134 },
      { id: '2c', text: 'Java - Strong fundamentals and job market', votes: 89 },
      { id: '2d', text: 'C++ - Deep understanding of programming', votes: 34 },
      { id: '2e', text: 'Go - Modern and efficient', votes: 67 }
    ],
    totalVotes: 480,
    status: 'active',
    createdAt: new Date('2024-01-10'),
    isPublic: true
  },
  'demo': {
    id: 'demo',
    title: 'What\'s your favorite development framework?',
    description: 'Help us understand the current preferences in the developer community.',
    options: [
      { id: 'react', text: 'React - Component-based and flexible', votes: 145 },
      { id: 'vue', text: 'Vue.js - Progressive and approachable', votes: 89 },
      { id: 'angular', text: 'Angular - Full-featured and structured', votes: 67 },
      { id: 'svelte', text: 'Svelte - Compile-time optimized', votes: 34 },
      { id: 'solid', text: 'SolidJS - Fine-grained reactivity', votes: 23 }
    ],
    totalVotes: 358,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-02-15'),
    isPublic: true
  }
};

export default function VotePage() {
  const params = useParams();
  const pollId = params.id as string;
  const [poll, setPoll] = useState<Poll | null>(mockPolls[pollId] || null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionId: string) => {
    if (!poll || hasVoted) return;

    setPoll(prevPoll => ({
      ...prevPoll!,
      options: prevPoll!.options.map(option =>
        option.id === optionId
          ? { ...option, votes: option.votes + 1 }
          : option
      ),
      totalVotes: prevPoll!.totalVotes + 1
    }));
    
    setHasVoted(true);
  };

  if (!poll) {
    return (
      <div className="grain-bg min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 pointer-events-none" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Poll Not Found</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                This poll doesn't exist, has been removed, or the link is incorrect.
              </p>
            </div>
            <Button asChild>
              <Link href="/polls">Browse Other Polls</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (poll.status === 'closed') {
    return (
      <div className="grain-bg min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 pointer-events-none" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center space-y-6 mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Voting Closed</h1>
                <p className="text-neutral-600 dark:text-neutral-400">
                  This poll is no longer accepting votes, but you can still view the results.
                </p>
              </div>
            </div>
            
            <PollCard
              poll={poll}
              variant="default"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grain-bg min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 pointer-events-none" />
      <div className="absolute inset-0 mix-blend-overlay pointer-events-none z-[1] dark:mix-blend-screen">
        <Noise
          patternSize={250}
          patternRefreshInterval={8}
          patternAlpha={20}
          useThemeColor={true}
          themeColorIntensity={0.08}
          className="dark:opacity-60"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-themed/10 via-primary-themed/5 to-primary-themed/10 border border-primary-themed/20 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-primary-themed animate-pulse"></div>
              <span className="text-sm font-medium text-primary-themed">
                Cast Your Vote
              </span>
            </div>
            
            {hasVoted ? (
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Thank You for Voting! 🎉</h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Your response has been recorded. Here are the current results:
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Your Opinion Matters</h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Click on your preferred option to cast your vote
                </p>
              </div>
            )}
          </div>

          {/* Poll Card */}
          <PollCard
            poll={poll}
            variant="voting"
            showVoteButton={true}
            onVote={handleVote}
          />

          {/* Post-vote actions */}
          {hasVoted && (
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60 text-center space-y-4 animate-in slide-in-from-bottom-5 duration-500">
              <h3 className="font-semibold">What's next?</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/polls">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Browse More Polls
                  </Link>
                </Button>
                <Button asChild className="bg-primary-themed hover:opacity-90 text-white">
                  <Link href="/polls/new">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your Own Poll
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Powered by */}
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-themed transition-colors"
            >
              <span>Powered by</span>
              <span className="font-semibold">Polley</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}