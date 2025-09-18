
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
}

interface ChatAreaProps {
  selectedCoach: Coach | null;
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export function ChatArea({
  selectedCoach,
  messages,
  input,
  setInput,
  handleSubmit,
  selectedModel,
  setSelectedModel,
}: ChatAreaProps) {
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{selectedCoach?.name || 'Select a Coach'}</h2>
        <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
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
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {selectedCoach?.name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
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
        <MessageInput input={input} setInput={setInput} handleSubmit={handleSubmit} />
      </footer>
    </div>
  );
}
