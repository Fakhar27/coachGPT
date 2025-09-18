
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChatClient } from './chat-client';
import { cookies } from 'next/headers';

export default async function ChatPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: coaches, error } = await supabase.from('coaches').select('*');

  if (error) {
    console.error('Error fetching coaches:', error);
    // Optionally, render an error state
  }

  return <ChatClient coaches={coaches || []} />;
}
