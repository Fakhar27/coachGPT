
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
    <div className="h-full flex flex-col">
      <header className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-background">
        <div className="flex-1 min-w-0 mr-4">
          <h2 className="text-lg font-semibold truncate">
            {selectedCoach?.name || 'Select a Coach'}
          </h2>
          {selectedCoach && (
            <p className="text-xs text-muted-foreground truncate">
              {selectedCoach.description}
            </p>
          )}
        </div>
        <ModelSelector 
          selectedModel={selectedModel} 
          setSelectedModel={setSelectedModel}
          models={models}
        />
      </header>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && selectedCoach && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-lg mb-2">Ready to chat with {selectedCoach.name}</p>
              <p className="text-sm">Using {models.find(m => m.id === selectedModel)?.name || selectedModel}</p>
            </div>
          )}
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
                    <AvatarFallback className="text-xs">
                      {selectedCoach?.icon || selectedCoach?.name?.charAt(0) || 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  {message.model && (
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {message.model}
                    </span>
                  )}
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="flex-shrink-0 border-t bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput 
            input={input} 
            setInput={setInput} 
            handleSubmit={handleSubmit}
            disabled={isLoading || !selectedCoach}
            placeholder={isLoading ? 'Waiting for response...' : `Message ${selectedCoach?.name || 'a coach'}...`}
          />
        </div>
      </footer>
    </div>
  );
}
