import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function subscribe(plan) {
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    alert("Please log in first.");
    return;
  }

  // Call backend API to create Stripe checkout session
  const res = await fetch(`/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, userId: user.id })
  });

  const { url } = await res.json();
  window.location.href = url; // Redirect to Stripe checkout
}
