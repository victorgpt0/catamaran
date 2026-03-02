'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createManualBooking(formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string // 'charter', 'hotel', 'maintenance'
  const start = formData.get('start') as string
  const end = formData.get('end') as string
  const price = formData.get('price') as string
  
  // Format the Postgres Range: [start, end)
  // We assume the admin enters ISO strings or simpler date inputs
  const startTime = new Date(start)
  const endTime = new Date(end)
  
  // DB Insert
  const { error } = await supabase
    .from('bookings')
    .insert({
      customer_name: name,
      customer_email: 'admin@internal', // Placeholder for manual blocks
      booking_type: type === 'maintenance' ? 'charter' : type, // DB constraint expects 'charter' or 'hotel'
      duration: `[${startTime.toISOString()}, ${endTime.toISOString()})`,
      total_price: Number(price) * 100, // Convert to øre
      status: 'confirmed' // Skip pending, go straight to confirmed
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}