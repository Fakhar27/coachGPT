import { redirect } from 'next/navigation';

export default function HomePage() {
  // For demo, redirect straight to chat
  redirect('/chat');
}
