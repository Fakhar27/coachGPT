
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  input, 
  setInput, 
  handleSubmit, 
  disabled = false,
  placeholder = "Send a message..."
}: MessageInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="pr-12 h-12"
        disabled={disabled}
      />
      <Button 
        type="submit" 
        size="icon" 
        className="absolute top-1/2 right-2 -translate-y-1/2"
        disabled={disabled || !input.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
