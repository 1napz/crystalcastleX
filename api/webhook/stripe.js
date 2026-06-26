import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import bodyParser from 'body-parser'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ต้องใช้ raw body สำหรับ Stripe webhook
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature']

  let event
  try {
    const rawBody = await new Promise((resolve) => {
      let data = ''
      req.on('data', (chunk) => { data += chunk })
      req.on('end', () => { resolve(data) })
    })

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle subscription events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata.userId
    const plan = session.metadata.plan

    // อัปเดต Supabase subscription เป็น active
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: plan === 'pro'
          ? new Date(Date.now() + 30*24*60*60*1000).toISOString()  -- 30 วัน
          : null
      })
      .eq('user_id', userId)
      .eq('plan', plan)
  }

  res.json({ received: true })
}
