'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PollCard } from '@/components/poll-card';
import { Noise } from '@/components/ui/noise';
import { getPollResults, castVote, hasUserVoted } from '@/lib/supabase/polls';
import type { Poll } from '@/lib/types/database';

export default function VotePage() {
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

  const handleVote = async (optionId: string) => {
    if (!poll || hasVoted) return;

    try {
      // Cast the vote
      const { error: voteError } = await castVote({
        pollId: poll.id,
        optionId: optionId
      });

      if (voteError) {
        alert(`Error casting vote: ${voteError}`);
        return;
      }

      // Reload poll results to get updated vote counts
      const { data: updatedPoll, error: pollError } = await getPollResults(pollId);
      
      if (pollError) {
        console.error('Error reloading poll:', pollError);
      } else if (updatedPoll) {
        setPoll(updatedPoll);
      }
      
      setHasVoted(true);
    } catch (err) {
      console.error('Error voting:', err);
      alert('An unexpected error occurred while voting');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="grain-bg min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 pointer-events-none" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-themed/10 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary-themed/30 border-t-primary-themed rounded-full animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Loading Poll...</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Please wait while we fetch the poll data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !poll) {
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
              <h1 className="text-2xl font-bold mb-2">
                {error === 'Poll not found' ? 'Poll Not Found' : 'Error Loading Poll'}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {error || 'This poll doesn\'t exist, has been removed, or the link is incorrect.'}
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