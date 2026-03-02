'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function verifyAdmin(formData: FormData) {
  const code = formData.get('passcode') as string
  
  // Simple Environment Variable Check
  if (code === process.env.ADMIN_PASSWORD) {
    
    // Set the cookie (Expires in 24 hours)
    (await cookies()).set('admin_session', 'true', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/' 
    })
    
    redirect('/admin')
  }

  return { success: false, error: 'Incorrect Code' }
}