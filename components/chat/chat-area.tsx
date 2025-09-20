
'use client';

import * as React from 'react';
import { ModelSelector } from './model-selector';
import { MessageInput } from './message-input';
import { Coach } from './sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Assuming Avatar is in ui

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

interface Model {
  id: string;
  name: string;
  provider: string;
}

interface ChatAreaProps {
  selectedCoach: Coach | null;
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  models: Model[];
  isLoading: boolean;
}

export function ChatArea({
  selectedCoach,
  messages,
  input,
  setInput,
  handleSubmit,
  selectedModel,
  setSelectedModel,
  models,
  isLoading,
}: ChatAreaProps) {
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-bold">{selectedCoach?.name || 'Select a Coach'}</h2>
          {selectedCoach && (
            <p className="text-sm text-muted-foreground">{selectedCoach.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ModelSelector 
            selectedModel={selectedModel} 
            setSelectedModel={setSelectedModel}
            models={models}
          />
        </div>
      </header>

      <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex flex-col items-center gap-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {selectedCoach?.icon || selectedCoach?.name?.charAt(0) || 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  {message.model && (
                    <span className="text-xs text-muted-foreground">
                      {message.model}
                    </span>
                  )}
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="p-4 border-t">
        <MessageInput 
          input={input} 
          setInput={setInput} 
          handleSubmit={handleSubmit}
          disabled={isLoading || !selectedCoach}
          placeholder={isLoading ? 'Waiting for response...' : `Message ${selectedCoach?.name || 'a coach'}...`}
        />
      </footer>
    </div>
  );
}
