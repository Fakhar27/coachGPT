
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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-11"
        disabled={disabled}
        autoFocus
      />
      <Button 
        type="submit" 
        size="default"
        className="px-3"
        disabled={disabled || !input.trim()}
      >
        <Send className="h-4 w-4 mr-1.5" />
        Send
      </Button>
    </form>
  );
}
