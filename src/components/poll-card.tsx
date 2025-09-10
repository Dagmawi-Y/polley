'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Noise } from '@/components/ui/noise';
import { cn } from '@/lib/utils';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  totalVotes: number;
  status: 'active' | 'closed' | 'draft';
  createdAt: Date;
  expiresAt?: Date;
  isPublic: boolean;
  allowMultiple?: boolean;
}

interface PollCardProps {
  poll: Poll;
  variant?: 'default' | 'voting' | 'compact';
  showVoteButton?: boolean;
  onVote?: (optionId: string) => void;
  className?: string;
}

export function PollCard({ 
  poll, 
  variant = 'default', 
  showVoteButton = false,
  onVote,
  className 
}: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return;
    
    setIsVoting(true);
    setSelectedOption(optionId);
    
    // Simulate voting delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (onVote) {
      onVote(optionId);
    }
    
    setHasVoted(true);
    setIsVoting(false);
  };

  const getStatusColor = (status: Poll['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'closed': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'draft': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20';
    }
  };

  const getOptionPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? (votes / poll.totalVotes) * 100 : 0;
  };

  const maxVotes = Math.max(...poll.options.map(opt => opt.votes));

  if (variant === 'compact') {
    return (
      <Link href={`/polls/${poll.id}`}>
        <div className={cn(
          "group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60",
          "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm",
          "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-themed/10",
          "cursor-pointer",
          className
        )}>
          {/* Grain texture */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <Noise
              patternSize={120}
              patternAlpha={8}
              useThemeColor={true}
              themeColorIntensity={0.05}
            />
          </div>
          
          {/* Content */}
          <div className="relative p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary-themed transition-colors">
                {poll.title}
              </h3>
              <Badge variant="outline" className={cn("text-xs shrink-0", getStatusColor(poll.status))}>
                {poll.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
              <span>{poll.totalVotes} votes</span>
              <span>{poll.options.length} options</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60",
      "bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm",
      "transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary-themed/15",
      !showVoteButton && "cursor-pointer",
      className
    )}>
      {/* Animated grain texture */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay dark:mix-blend-screen">
        <Noise
          patternSize={200}
          patternRefreshInterval={6}
          patternAlpha={12}
          useThemeColor={true}
          themeColorIntensity={0.08}
          className="group-hover:opacity-60 transition-opacity duration-500"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-themed/5 via-transparent to-primary-themed/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-themed/40 to-transparent" />

      {/* Content wrapper */}
      <div className="relative">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary-themed transition-colors duration-300">
                {poll.title}
              </h3>
              {poll.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {poll.description}
                </p>
              )}
            </div>
            <Badge variant="outline" className={cn("shrink-0", getStatusColor(poll.status))}>
              {poll.status}
            </Badge>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary-themed animate-pulse" />
              <span className="font-medium">{poll.totalVotes} votes</span>
            </div>
            <span>•</span>
            <span>{poll.options.length} options</span>
            {poll.expiresAt && (
              <>
                <span>•</span>
                <span>Expires {poll.expiresAt.toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Poll Options */}
        <div className="px-6 pb-6 space-y-3">
          {poll.options.map((option, index) => {
            const percentage = getOptionPercentage(option.votes);
            const isSelected = selectedOption === option.id;
            const isWinning = option.votes === maxVotes && maxVotes > 0;
            
            return (
              <div
                key={option.id}
                className={cn(
                  "relative overflow-hidden rounded-xl border transition-all duration-300",
                  showVoteButton && poll.status === 'active' && !hasVoted
                    ? "cursor-pointer hover:scale-[1.01] hover:shadow-md"
                    : "cursor-default",
                  isSelected && isVoting
                    ? "border-primary-themed/60 bg-primary-themed/10"
                    : "border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-800/30",
                  isWinning && hasVoted && "ring-2 ring-primary-themed/30"
                )}
                onClick={() => showVoteButton && poll.status === 'active' && !hasVoted && handleVote(option.id)}
              >
                {/* Progress bar background */}
                {(hasVoted || poll.totalVotes > 0) && (
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 transition-all duration-1000 ease-out",
                      isWinning 
                        ? "bg-gradient-to-r from-primary-themed/20 to-primary-themed/10"
                        : "bg-gradient-to-r from-neutral-200/60 to-neutral-100/40 dark:from-neutral-700/40 dark:to-neutral-800/20"
                    )}
                    style={{ 
                      width: hasVoted ? `${percentage}%` : '0%',
                      transitionDelay: isSelected ? '0.5s' : `${index * 0.1}s`
                    }}
                  />
                )}

                {/* Option content */}
                <div className="relative p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Option indicator */}
                    <div className={cn(
                      "w-3 h-3 rounded-full border-2 transition-all duration-300",
                      isSelected && isVoting
                        ? "border-primary-themed bg-primary-themed animate-pulse"
                        : hasVoted && isWinning
                        ? "border-primary-themed bg-primary-themed"
                        : "border-neutral-300 dark:border-neutral-600"
                    )} />
                    
                    <span className={cn(
                      "font-medium transition-colors duration-300",
                      isWinning && hasVoted && "text-primary-themed"
                    )}>
                      {option.text}
                    </span>
                  </div>

                  {/* Vote count and percentage */}
                  <div className="flex items-center gap-2 text-sm">
                    {(hasVoted || poll.totalVotes > 0) && (
                      <span className={cn(
                        "font-semibold transition-colors duration-300",
                        isWinning && hasVoted && "text-primary-themed"
                      )}>
                        {percentage.toFixed(1)}%
                      </span>
                    )}
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {option.votes}
                    </span>
                  </div>
                </div>

                {/* Loading indicator for selected option */}
                {isSelected && isVoting && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-themed/20">
                    <div className="h-full bg-primary-themed animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 border-t border-neutral-200/40 dark:border-neutral-800/40">
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Created {poll.createdAt.toLocaleDateString()}
            </div>
            
            {!showVoteButton ? (
              <Link href={`/polls/${poll.id}`}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary-themed hover:bg-primary-themed/10 transition-all duration-300 hover:scale-105"
                >
                  View Details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            ) : hasVoted ? (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Vote recorded!
              </div>
            ) : poll.status !== 'active' ? (
              <Badge variant="outline" className="text-xs">
                {poll.status === 'closed' ? 'Voting closed' : 'Not active'}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}