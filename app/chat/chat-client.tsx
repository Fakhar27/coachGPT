
'use client';

import * as React from 'react';
import { Sidebar, Coach } from '@/components/chat/sidebar';
import { ChatArea, Message } from '@/components/chat/chat-area';

interface Model {
  id: string;
  name: string;
  provider: string;
}

interface ChatClientProps {
  coaches: Coach[];
  models: Model[];
}

export function ChatClient({ coaches, models }: ChatClientProps) {
  const [selectedCoach, setSelectedCoach] = React.useState<Coach | null>(coaches[0] || null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('gpt-4o-mini');
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !selectedCoach || isLoading) return;

    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/cortex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          coachId: selectedCoach.id,
          coachInstructions: selectedCoach.instructions,
          model: selectedModel,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Update conversation ID for persistence
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Add assistant message with model info
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        model: data.model,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-[300px] flex-shrink-0">
        <Sidebar
          coaches={coaches}
          selectedCoach={selectedCoach}
          onCoachSelect={setSelectedCoach}
          onNewChat={handleNewChat}
        />
      </div>
      <div className="flex-1 min-w-0">
        <ChatArea
          selectedCoach={selectedCoach}
          messages={messages}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          models={models}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
