'use server'

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { differenceInDays } from 'date-fns'
import { Resend } from 'resend';
import BookingReceipt from '@/components/emails/booking-receipt';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export async function createBooking(
  formData: FormData, 
  startDate: Date | undefined, 
  endDate: Date | undefined, 
  mode: 'charter' | 'hotel' | 'expedition'
) {
  console.log("Received Booking Request:")
  if (!startDate) return { success: false, error: "No start date selected" }

  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const timeSlot = formData.get('timeSlot') as string
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Default to 1 guest if missing, or 4 if expedition
  const rawGuests = formData.get('guestCount')
  const guestCount = rawGuests ? Number(rawGuests) : (mode === 'expedition' ? 4 : 1)

  let startTimestamp = new Date(startDate)
  let endTimestamp = (mode !== 'charter' && endDate) ? new Date(endDate) : new Date(startDate)

  let calculatedPrice = 0
  let description = ""

  // --- 2. PRICE CALCULATION LOGIC ---
  if (mode === 'charter') {
    const [hours] = timeSlot ? timeSlot.split(':').map(Number) : [9]
    startTimestamp.setHours(hours, 0, 0)
    endTimestamp.setHours(hours + 4, 0, 0)
    
    calculatedPrice = 40000
    description = `Charter: ${startDate.toDateString()} @ ${timeSlot}`

  } else if (mode === 'hotel') {
    startTimestamp.setHours(15, 0, 0)
    endTimestamp.setHours(15, 0, 0)
    
    const nights = differenceInDays(endTimestamp, startTimestamp)
    if (nights < 1) return { success: false, error: "Stay must be at least 1 night" }

    calculatedPrice = nights * 6000
    description = `Hotel Stay: ${nights} Nights`

  } else if (mode === 'expedition') {
    startTimestamp.setHours(12, 0, 0)
    endTimestamp.setHours(12, 0, 0)
    
    const nights = differenceInDays(endTimestamp, startTimestamp)
    
    // Safety check for dates
    if (nights < 1) return { success: false, error: "Expedition must be at least 1 night" }

    calculatedPrice = nights * guestCount * 4500
    description = `Expedition: ${nights} Nights for ${guestCount} Guests`
  }

  console.log("Calculated Price:", calculatedPrice) // <--- CRITICAL CHECK

  // --- 3. THE SAFETY NET ---
  // If logic failed and price is 0, DO NOT send to Stripe.
  if (calculatedPrice <= 0) {
    return { success: false, error: "Price calculation failed (0 NOK). Please check dates." }
  }

  // --- 4. DATABASE INSERT ---
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      customer_name: name,
      customer_email: email,
      booking_type: mode,
      duration: `[${startTimestamp.toISOString()}, ${endTimestamp.toISOString()})`,
      total_price: calculatedPrice * 100, // Store in øre
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error("Supabase Error:", error)
    return { success: false, error: error.message }
  }

  if (booking) {
    // 2. Send the Email
    await resend.emails.send({
      from: 'Valhalla Voyage <onboarding@resend.dev>', // Use this for testing
      to: email, // The customer's email
      subject: 'Your Valhalla Voyage Reservation',
      react: BookingReceipt({
        customerName: name,
        bookingType: mode,
        dateRange: `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`,
        totalPrice: `${calculatedPrice.toLocaleString()} NOK`,
        bookingId: booking.id
      }),
    });
}

  // --- 5. STRIPE CHECKOUT ---
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'nok',
            product_data: {
              name: mode === 'expedition' ? "Valhalla Expedition" : (mode === 'charter' ? "Fjord Charter" : "Valhalla Suite"),
              description: description,
            },
            unit_amount: calculatedPrice * 100, // Amount in øre
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?booking_id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      customer_email: email,
      metadata: { 
        booking_id: booking.id,
        customer_name: name,
        booking_type: mode,
        start_date: startDate.toISOString(), // Pass these so we can put them in the email later
        end_date: endDate?.toISOString() || startDate.toISOString()
      },
    })

    if (session.url) {
      return { success: true, redirectUrl: session.url }
    }
  } catch (e: any) {
    console.error("Stripe Error:", e)
    return { success: false, error: e.message }
  }

  return { success: false, error: "Unknown error occurred" }
}