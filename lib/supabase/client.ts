import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
<<<<<<< HEAD
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
=======
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
>>>>>>> 100052ec116f38a4a6bb0bc64c2055a352fdbe26
  );
}
