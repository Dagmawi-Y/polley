import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PollCard, type Poll } from "@/components/poll-card";

// Mock data for demonstration
const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'What\'s your favorite season?',
    description: 'Help us understand seasonal preferences for our upcoming product launch.',
    options: [
      { id: '1a', text: 'Spring', votes: 45 },
      { id: '1b', text: 'Summer', votes: 78 },
      { id: '1c', text: 'Fall', votes: 62 },
      { id: '1d', text: 'Winter', votes: 23 }
    ],
    totalVotes: 208,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-02-15'),
    isPublic: true
  },
  {
    id: '2',
    title: 'Best programming language for beginners?',
    description: 'Share your thoughts on which language newcomers should learn first.',
    options: [
      { id: '2a', text: 'Python', votes: 156 },
      { id: '2b', text: 'JavaScript', votes: 134 },
      { id: '2c', text: 'Java', votes: 89 },
      { id: '2d', text: 'C++', votes: 34 },
      { id: '2e', text: 'Go', votes: 67 }
    ],
    totalVotes: 480,
    status: 'active',
    createdAt: new Date('2024-01-10'),
    isPublic: true
  },
  {
    id: '3',
    title: 'Remote work vs Office work',
    description: 'What\'s your preference for the future of work?',
    options: [
      { id: '3a', text: 'Fully remote', votes: 89 },
      { id: '3b', text: 'Hybrid (2-3 days office)', votes: 145 },
      { id: '3c', text: 'Mostly office', votes: 34 },
      { id: '3d', text: 'Fully office', votes: 12 }
    ],
    totalVotes: 280,
    status: 'closed',
    createdAt: new Date('2024-01-05'),
    expiresAt: new Date('2024-01-20'),
    isPublic: true
  },
  {
    id: '4',
    title: 'Coffee or Tea?',
    description: 'The eternal debate - what\'s your morning fuel?',
    options: [
      { id: '4a', text: 'Coffee', votes: 234 },
      { id: '4b', text: 'Tea', votes: 167 },
      { id: '4c', text: 'Both', votes: 89 },
      { id: '4d', text: 'Neither', votes: 23 }
    ],
    totalVotes: 513,
    status: 'active',
    createdAt: new Date('2024-01-12'),
    isPublic: true
  },
  {
    id: '5',
    title: 'Weekend Plans Survey',
    description: 'How do you prefer to spend your weekends?',
    options: [
      { id: '5a', text: 'Outdoor activities', votes: 67 },
      { id: '5b', text: 'Reading & relaxing', votes: 45 },
      { id: '5c', text: 'Social gatherings', votes: 78 },
      { id: '5d', text: 'Hobbies & crafts', votes: 34 }
    ],
    totalVotes: 224,
    status: 'draft',
    createdAt: new Date('2024-01-18'),
    isPublic: false
  },
  {
    id: '6',
    title: 'Favorite Movie Genre',
    options: [
      { id: '6a', text: 'Action', votes: 89 },
      { id: '6b', text: 'Comedy', votes: 123 },
      { id: '6c', text: 'Drama', votes: 67 },
      { id: '6d', text: 'Sci-Fi', votes: 145 },
      { id: '6e', text: 'Horror', votes: 34 }
    ],
    totalVotes: 458,
    status: 'active',
    createdAt: new Date('2024-01-08'),
    isPublic: true
  }
];

export default function PollsPage() {
  return (
    <div className="grain-bg min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 pointer-events-none" />

      <div className="container mx-auto px-4 py-8 space-y-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Polls</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage and view all your polls in one place
            </p>
          </div>
          <Button asChild className="bg-primary-themed hover:opacity-90 text-white shadow-lg hover:shadow-primary-themed/25 transition-all duration-300 hover:scale-105">
            <Link href="/polls/new">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Poll
            </Link>
          </Button>
        </div>

        {/* Filter tabs and demo link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Active', 'Closed', 'Draft'].map((filter) => (
              <Button
                key={filter}
                variant={filter === 'All' ? 'default' : 'outline'}
                size="sm"
                className={filter === 'All' ? 'bg-primary-themed text-white' : ''}
              >
                {filter}
              </Button>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="hover:bg-primary-themed/10 hover:border-primary-themed/30">
            <Link href="/polls/demo">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try Interactive Demo
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-2xl font-bold text-primary-themed mb-1">
              {mockPolls.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Active Polls</div>
          </div>
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-2xl font-bold text-primary-themed mb-1">
              {mockPolls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Votes</div>
          </div>
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="text-2xl font-bold text-primary-themed mb-1">
              {mockPolls.length}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Polls</div>
          </div>
        </div>

        {/* Poll Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mockPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              variant="default"
            />
          ))}
        </div>

        {/* Empty state (hidden when we have polls) */}
        <div className="hidden text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-themed/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-themed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No polls yet</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Create your first poll to get started
          </p>
          <Button asChild>
            <Link href="/polls/new">Create Your First Poll</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
