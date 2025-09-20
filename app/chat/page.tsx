
import { createClient } from '@/lib/supabase/server';
import { ChatClient } from './chat-client';
import { cookies } from 'next/headers';

export default async function ChatPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // No auth check - straight to coaches for demo
  const { data: coaches, error } = await supabase
    .from('coaches')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching coaches:', error);
  }

  // Available models for Cortex
  const models = [
    // OpenAI
    { id: "gpt-4o", name: "GPT-4 Optimized", provider: "OpenAI" },
    { id: "gpt-4o-mini", name: "GPT-4 Mini", provider: "OpenAI" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
    
    // Google
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google" },
    
    // Cohere
    { id: "command-r", name: "Command R", provider: "Cohere" },
    { id: "command-r-plus", name: "Command R+", provider: "Cohere" }
  ];

  return <ChatClient coaches={coaches || []} models={models} />;
}
