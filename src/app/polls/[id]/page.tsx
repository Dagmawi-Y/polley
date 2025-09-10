'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PollCard, type Poll } from '@/components/poll-card';

// Mock poll data - in a real app, this would come from your database
const mockPolls: Record<string, Poll> = {
  '1': {
    id: '1',
    title: 'What\'s your favorite season?',
    description: 'Help us understand seasonal preferences for our upcoming product launch. This poll will help inform our marketing strategy and product timing decisions.',
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
    description: 'Share your thoughts on which language newcomers should learn first. Your input will help us create better educational content.',
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
    description: 'Help us understand the current preferences in the developer community. This poll helps inform our technology choices.',
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

export default function PollPage() {
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Poll Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              The poll you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/polls">Back to Polls</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grain-bg min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 space-y-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/polls" className="hover:text-primary-themed transition-colors">
            Polls
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-neutral-900 dark:text-neutral-100 font-medium">
            {poll.title}
          </span>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Poll Card */}
            <div className="lg:col-span-2">
              <PollCard
                poll={poll}
                variant="voting"
                showVoteButton={true}
                onVote={handleVote}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share Card */}
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-themed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share this poll
                </h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Generate QR Code
                  </Button>
                </div>
              </div>

              {/* Poll Stats */}
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-themed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Poll Statistics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Total Votes</span>
                    <span className="font-semibold">{poll.totalVotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Options</span>
                    <span className="font-semibold">{poll.options.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Status</span>
                    <Badge variant="outline" className="text-xs">
                      {poll.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Created</span>
                    <span className="font-semibold">{poll.createdAt.toLocaleDateString()}</span>
                  </div>
                  {poll.expiresAt && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600 dark:text-neutral-400">Expires</span>
                      <span className="font-semibold">{poll.expiresAt.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60 space-y-3">
                <h3 className="font-semibold">Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Poll
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Results
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}