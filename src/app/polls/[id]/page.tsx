'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PollCard } from '@/components/poll-card';
import { getPollResults, hasUserVoted } from '@/lib/supabase/polls';
import type { Poll } from '@/lib/types/database';

export default function PollPage() {
  const params = useParams();
  const pollId = params.id as string;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load poll data on mount
  useEffect(() => {
    async function loadPoll() {
      try {
        setLoading(true);
        
        // Get poll results
        const { data: pollData, error: pollError } = await getPollResults(pollId);
        
        if (pollError) {
          setError(pollError);
          return;
        }
        
        if (!pollData) {
          setError('Poll not found');
          return;
        }
        
        setPoll(pollData);
        
        // Check if user has already voted
        const { data: voted } = await hasUserVoted(pollId);
        setHasVoted(voted);
        
      } catch (err) {
        console.error('Error loading poll:', err);
        setError('Failed to load poll');
      } finally {
        setLoading(false);
      }
    }

    if (pollId) {
      loadPoll();
    }
  }, [pollId]);

  // Loading state
  if (loading) {
    return (
      <div className="grain-bg min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-themed/10 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary-themed/30 border-t-primary-themed rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl font-bold">Loading Poll...</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Please wait while we fetch the poll data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !poll) {
    return (
      <div className="grain-bg min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              {error === 'Poll not found' ? 'Poll Not Found' : 'Error Loading Poll'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {error || 'The poll you\'re looking for doesn\'t exist or has been removed.'}
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
                variant="default"
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