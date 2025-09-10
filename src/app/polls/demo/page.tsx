'use client';

import { useState } from 'react';
import { PollCard, type Poll } from '@/components/poll-card';
import { Button } from '@/components/ui/button';

// Demo poll data
const initialPoll: Poll = {
  id: 'demo',
  title: 'What\'s your favorite development framework?',
  description: 'Help us understand the current preferences in the developer community. This is an interactive demo - try voting!',
  options: [
    { id: 'react', text: 'React', votes: 145 },
    { id: 'vue', text: 'Vue.js', votes: 89 },
    { id: 'angular', text: 'Angular', votes: 67 },
    { id: 'svelte', text: 'Svelte', votes: 34 },
    { id: 'solid', text: 'SolidJS', votes: 23 }
  ],
  totalVotes: 358,
  status: 'active',
  createdAt: new Date('2024-01-15'),
  expiresAt: new Date('2024-02-15'),
  isPublic: true
};

export default function PollDemoPage() {
  const [poll, setPoll] = useState<Poll>(initialPoll);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    setPoll(prevPoll => ({
      ...prevPoll,
      options: prevPoll.options.map(option =>
        option.id === optionId
          ? { ...option, votes: option.votes + 1 }
          : option
      ),
      totalVotes: prevPoll.totalVotes + 1
    }));
    
    setHasVoted(true);
  };

  const resetDemo = () => {
    setPoll(initialPoll);
    setHasVoted(false);
  };

  return (
    <div className="grain-bg min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 space-y-8 relative">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Interactive Poll Demo</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Experience the beautiful poll cards in action. Click on any option to vote and see the real-time results animation.
          </p>
          <Button 
            onClick={resetDemo}
            variant="outline"
            className="hover:bg-primary-themed/10 hover:border-primary-themed/30"
          >
            Reset Demo
          </Button>
        </div>

        {/* Demo Poll Cards */}
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Voting Card */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center">Interactive Voting Card</h2>
            <PollCard
              poll={poll}
              variant="voting"
              showVoteButton={true}
              onVote={handleVote}
            />
          </div>

          {/* Comparison Cards */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">Different Card Variants</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Default Card */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 text-center">Default Card</h3>
                <PollCard
                  poll={poll}
                  variant="default"
                />
              </div>

              {/* Compact Card */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 text-center">Compact Card</h3>
                <PollCard
                  poll={poll}
                  variant="compact"
                />
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60 space-y-4">
            <h3 className="text-lg font-semibold">✨ Card Features</h3>
            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                <div>
                  <strong>Interactive Voting:</strong> Click options to vote with smooth animations
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div>
                  <strong>Real-time Results:</strong> Progress bars animate to show vote percentages
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
                <div>
                  <strong>Beautiful Design:</strong> Grain textures, themed colors, and smooth hover effects
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                <div>
                  <strong>Status Indicators:</strong> Clear badges for active, closed, and draft polls
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                <div>
                  <strong>Responsive Layout:</strong> Works perfectly on all screen sizes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}