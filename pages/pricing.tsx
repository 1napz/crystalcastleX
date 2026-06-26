import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setSubscription(data)
      }
    }
    fetchUser()
  }, [])

  const subscribe = async (plan: string) => {
    if (!user) {
      alert("Please log in first")
      return
    }

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, userId: user.id })
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div>
      <h1>Choose Your Plan</h1>
      <div className="plans">
        <div className="plan">
          <h2>Free</h2>
          <p>• 5 videos/day<br/>• Watermark included</p>
          <button disabled>Current Plan</button>
        </div>
        <div className="plan">
          <h2>Pro</h2>
          <p>• Unlimited videos<br/>• No watermark<br/>• Priority support</p>
          <button onClick={() => subscribe('pro')}>Upgrade</button>
        </div>
        <div className="plan">
          <h2>Enterprise</h2>
          <p>• Custom branding<br/>• Analytics dashboard<br/>• Dedicated support</p>
          <button onClick={() => subscribe('enterprise')}>Contact Sales</button>
        </div>
      </div>

      {subscription && (
        <div className="status">
          <h3>Your Subscription Status</h3>
          <p>Plan: {subscription.plan}</p>
          <p>Status: {subscription.status}</p>
          <p>Valid until: {subscription.end_date || 'N/A'}</p>
        </div>
      )}
    </div>
  )
}
