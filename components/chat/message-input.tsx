
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function MessageInput({ input, setInput, handleSubmit }: MessageInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Send a message..."
        className="pr-12 h-12"
      />
      <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2">
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
