
'use client';

import * as React from 'react';
import { Sidebar, Coach } from '@/components/chat/sidebar';
import { ChatArea, Message } from '@/components/chat/chat-area';

interface ChatClientProps {
  coaches: Coach[];
}

export function ChatClient({ coaches }: ChatClientProps) {
  const [selectedCoach, setSelectedCoach] = React.useState<Coach | null>(coaches[0] || null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('gpt-4o-mini');

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [...messages, userMessage],
        model: selectedModel,
      }),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantResponse = '';
    const assistantMessageId = Date.now().toString();

    // Add a placeholder for the assistant's message
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: 'assistant', content: '...' },
    ]);

    reader.read().then(function processText({ done, value }): Promise<void> {
      if (done) {
        return Promise.resolve();
      }

      assistantResponse += decoder.decode(value, { stream: true });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: assistantResponse }
            : msg
        )
      );

      return reader.read().then(processText);
    });
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen w-full">
      <Sidebar
        coaches={coaches}
        selectedCoach={selectedCoach}
        onCoachSelect={setSelectedCoach}
        onNewChat={handleNewChat}
      />
      <ChatArea
        selectedCoach={selectedCoach}
        messages={messages}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </div>
  );
}
