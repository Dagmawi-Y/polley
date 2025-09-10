'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PollCard } from "@/components/poll-card";
import { getPublicPolls } from '@/lib/supabase/polls';
import type { Poll } from '@/lib/types/database';

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('active');

  // Load polls on mount
  useEffect(() => {
    async function loadPolls() {
      try {
        setLoading(true);
        const { data: pollsData, error: pollsError } = await getPublicPolls(0, 20);
        
        if (pollsError) {
          setError(pollsError);
          return;
        }
        
        setPolls(pollsData || []);
      } catch (err) {
        console.error('Error loading polls:', err);
        setError('Failed to load polls');
      } finally {
        setLoading(false);
      }
    }

    loadPolls();
  }, []);

  const filteredPolls = polls.filter(poll => {
    if (filter === 'all') return true;
    return poll.status === filter;
  });

  const activePolls = polls.filter(p => p.status === 'active').length;
  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);

  return (
    <div className="grain-bg min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 space-y-8 relative">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Community Polls</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover what the community thinks. Vote on active polls or explore results from completed surveys.
          </p>
          <Button asChild className="bg-primary-themed hover:opacity-90 text-white">
            <Link href="/polls/new">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Poll
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-2xl font-bold text-primary-themed mb-1">
              {activePolls}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Active Polls</div>
          </div>
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-2xl font-bold text-primary-themed mb-1">
              {totalVotes}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Votes</div>
          </div>
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-2xl font-bold text-primary-themed mb-1">
              {polls.length}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Polls</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary-themed text-white' : ''}
            >
              All Polls
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('active')}
              className={filter === 'active' ? 'bg-primary-themed text-white' : ''}
            >
              Active
            </Button>
            <Button
              variant={filter === 'closed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('closed')}
              className={filter === 'closed' ? 'bg-primary-themed text-white' : ''}
            >
              Closed
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-themed/10 flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-2 border-primary-themed/30 border-t-primary-themed rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Loading Polls...</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Please wait while we fetch the latest polls.
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Polls</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredPolls.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Polls Found</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {filter === 'all' 
                ? 'No polls have been created yet.' 
                : `No ${filter} polls found.`}
            </p>
            <Button asChild>
              <Link href="/polls/new">Create the First Poll</Link>
            </Button>
          </div>
        )}

        {/* Poll Grid */}
        {!loading && !error && filteredPolls.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                variant="compact"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}