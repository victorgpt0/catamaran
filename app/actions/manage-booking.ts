'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Initialize Supabase with Service Role (Admin Access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function updateBookingStatus(formData: FormData) {
  const bookingId = formData.get('bookingId') as string
  const action = formData.get('action') as string // 'confirm' or 'cancel'

  // Determine the new status
  const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled'

  // Update Supabase
  const { error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId)

  if (error) {
    console.error('Update failed:', error)
    // No return value
  }

  // CRITICAL: This tells Next.js to reload the Admin Page immediately
  // so you see the new status without refreshing the browser.
  revalidatePath('/admin')
}