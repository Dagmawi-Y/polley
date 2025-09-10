'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PollCard, type Poll } from '@/components/poll-card';
import { Noise } from '@/components/ui/noise';
import { cn } from '@/lib/utils';

interface PollOption {
  id: string;
  text: string;
  placeholder?: string;
}

interface PollFormData {
  title: string;
  description: string;
  options: PollOption[];
  settings: {
    allowMultiple: boolean;
    isPublic: boolean;
    expiresAt: string;
    requireAuth: boolean;
  };
}

const INITIAL_OPTIONS: PollOption[] = [
  { id: '1', text: '', placeholder: 'First option...' },
  { id: '2', text: '', placeholder: 'Second option...' }
];

export default function CreatePollPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<PollFormData>({
    title: '',
    description: '',
    options: INITIAL_OPTIONS,
    settings: {
      allowMultiple: false,
      isPublic: true,
      expiresAt: '',
      requireAuth: false
    }
  });

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Title and description' },
    { id: 2, title: 'Options', description: 'Add poll choices' },
    { id: 3, title: 'Settings', description: 'Configure poll behavior' },
    { id: 4, title: 'Preview', description: 'Review and publish' }
  ];

  const addOption = () => {
    const newOption: PollOption = {
      id: Date.now().toString(),
      text: '',
      placeholder: `Option ${formData.options.length + 1}...`
    };
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const removeOption = (id: string) => {
    if (formData.options.length <= 2) return;
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== id)
    }));
  };

  const updateOption = (id: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === id ? { ...opt, text } : opt
      )
    }));
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return formData.title.trim().length > 0;
      case 2:
        return formData.options.filter(opt => opt.text.trim().length > 0).length >= 2;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && canProceed(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createPoll = async () => {
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you'd send this to your API
    console.log('Creating poll:', formData);
    
    // Generate a mock poll ID
    const pollId = `poll_${Date.now()}`;
    
    setIsCreating(false);
    router.push(`/polls/success?id=${pollId}`);
  };

  const getPreviewPoll = (): Poll => ({
    id: 'preview',
    title: formData.title || 'Your Poll Title',
    description: formData.description || 'Your poll description will appear here',
    options: formData.options
      .filter(opt => opt.text.trim().length > 0)
      .map((opt, index) => ({
        id: opt.id,
        text: opt.text || `Option ${index + 1}`,
        votes: Math.floor(Math.random() * 50)
      })),
    totalVotes: 0,
    status: 'draft' as const,
    createdAt: new Date(),
    expiresAt: formData.settings.expiresAt ? new Date(formData.settings.expiresAt) : undefined,
    isPublic: formData.settings.isPublic,
    allowMultiple: formData.settings.allowMultiple
  });

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
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold">Create New Poll</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Build engaging polls in minutes with our intuitive step-by-step wizard
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-800">
              <div 
                className="h-full bg-primary-themed transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="relative flex flex-col items-center cursor-pointer"
                onClick={() => setCurrentStep(step.id)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold bg-white dark:bg-neutral-900",
                  currentStep >= step.id
                    ? "border-primary-themed text-primary-themed"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-400"
                )}>
                  {currentStep > step.id ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={cn(
                    "font-medium text-sm",
                    currentStep >= step.id ? "text-primary-themed" : "text-neutral-500"
                  )}>
                    {step.title}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 p-8 relative overflow-hidden">
                {/* Card grain texture */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                  <Noise
                    patternSize={150}
                    patternAlpha={8}
                    useThemeColor={true}
                    themeColorIntensity={0.05}
                  />
                </div>

                <div className="relative space-y-6 min-h-[400px]">
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Let's start with the basics</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          Give your poll a compelling title and description
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title" className="text-base font-medium">
                            Poll Title *
                          </Label>
                          <Input
                            id="title"
                            placeholder="What's your question?"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="mt-2 text-lg h-12"
                            maxLength={100}
                          />
                          <div className="text-xs text-neutral-500 mt-1">
                            {formData.title.length}/100 characters
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-base font-medium">
                            Description (Optional)
                          </Label>
                          <textarea
                            id="description"
                            placeholder="Add context or additional details about your poll..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="mt-2 w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 resize-none h-24"
                            maxLength={300}
                          />
                          <div className="text-xs text-neutral-500 mt-1">
                            {formData.description.length}/300 characters
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Options */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Add your options</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          Create the choices people can vote on (minimum 2 required)
                        </p>
                      </div>

                      <div className="space-y-3">
                        {formData.options.map((option, optionIndex) => (
                          <div key={option.id} className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-primary-themed/10 text-primary-themed flex items-center justify-center text-sm font-medium shrink-0">
                              {optionIndex + 1}
                            </div>
                            <Input
                              placeholder={option.placeholder}
                              value={option.text}
                              onChange={(e) => updateOption(option.id, e.target.value)}
                              className="flex-1"
                              maxLength={80}
                            />
                            {formData.options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(option.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="secondary"
                        onClick={addOption}
                        className="w-full border-dashed border-2 hover:bg-primary-themed/5 hover:border-primary-themed/30"
                        disabled={formData.options.length >= 10}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Another Option ({formData.options.length}/10)
                      </Button>
                    </div>
                  )}

                  {/* Step 3: Settings */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Configure your poll</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          Set up how your poll behaves and who can participate
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* Visibility */}
                        <div className="space-y-3">
                          <Label className="text-base font-medium">Poll Visibility</Label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div
                              className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer",
                                formData.settings.isPublic
                                  ? "border-primary-themed bg-primary-themed/5"
                                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                              )}
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                settings: { ...prev.settings, isPublic: true }
                              }))}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2",
                                  formData.settings.isPublic
                                    ? "border-primary-themed bg-primary-themed"
                                    : "border-neutral-300"
                                )} />
                                <div>
                                  <div className="font-medium">Public</div>
                                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Anyone with the link can vote
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={cn(
                                "p-4 rounded-xl border-2 cursor-pointer",
                                !formData.settings.isPublic
                                  ? "border-primary-themed bg-primary-themed/5"
                                  : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                              )}
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                settings: { ...prev.settings, isPublic: false }
                              }))}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2",
                                  !formData.settings.isPublic
                                    ? "border-primary-themed bg-primary-themed"
                                    : "border-neutral-300"
                                )} />
                                <div>
                                  <div className="font-medium">Private</div>
                                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Only invited users can vote
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expiration */}
                        <div>
                          <Label htmlFor="expires" className="text-base font-medium">
                            Expiration Date (Optional)
                          </Label>
                          <Input
                            id="expires"
                            type="datetime-local"
                            value={formData.settings.expiresAt}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              settings: { ...prev.settings, expiresAt: e.target.value }
                            }))}
                            className="mt-2"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </div>

                        {/* Additional Settings */}
                        <div className="space-y-4">
                          <Label className="text-base font-medium">Additional Options</Label>
                          
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.settings.allowMultiple}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  settings: { ...prev.settings, allowMultiple: e.target.checked }
                                }))}
                                className="w-4 h-4 text-primary-themed rounded border-neutral-300 focus:ring-primary-themed"
                              />
                              <div>
                                <div className="font-medium">Allow multiple selections</div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                  Users can choose more than one option
                                </div>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.settings.requireAuth}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  settings: { ...prev.settings, requireAuth: e.target.checked }
                                }))}
                                className="w-4 h-4 text-primary-themed rounded border-neutral-300 focus:ring-primary-themed"
                              />
                              <div>
                                <div className="font-medium">Require authentication</div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                  Only logged-in users can vote
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Preview */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Review your poll</h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          Everything looks good? Let's publish your poll!
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Options:</span>
                            <span className="font-medium">
                              {formData.options.filter(opt => opt.text.trim().length > 0).length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600 dark:text-neutral-400">Visibility:</span>
                            <Badge variant="secondary">
                              {formData.settings.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                          {formData.settings.expiresAt && (
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">Expires:</span>
                              <span className="font-medium">
                                {new Date(formData.settings.expiresAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {formData.settings.allowMultiple && (
                            <div className="flex justify-between">
                              <span className="text-neutral-600 dark:text-neutral-400">Multiple choice:</span>
                              <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-200">
                                Enabled
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-themed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Live Preview
                </h3>
                <PollCard
                  poll={getPreviewPoll()}
                  variant="compact"
                />
              </div>

              {/* Tips */}
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800/60 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Tips for great polls
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-themed mt-2 shrink-0" />
                    <span>Keep your question clear and specific</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-themed mt-2 shrink-0" />
                    <span>Provide balanced and comprehensive options</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-themed mt-2 shrink-0" />
                    <span>Consider adding an "Other" option for flexibility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed(currentStep)}
                  className="bg-primary-themed hover:opacity-90 text-white flex items-center gap-2"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <Button
                  onClick={createPoll}
                  disabled={!canProceed(currentStep) || isCreating}
                  className="bg-primary-themed hover:opacity-90 text-white flex items-center gap-2 min-w-[140px]"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Create Poll
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
