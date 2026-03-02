'use client'

import { useState } from 'react'
import { verifyAdmin } from '../../actions/admin-auth'

export default function AdminLogin() {
  const [error, setError] = useState('')

  async function handleSubmit(formData: FormData) {
    const result = await verifyAdmin(formData)
    if (!result.success) {
      setError(result.error || 'Invalid Code')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm text-center">
        <h1 className="text-2xl font-serif font-bold mb-6">Captain's Log</h1>
        
        <form action={handleSubmit} className="space-y-4">
          <input 
            name="passcode" 
            type="password" 
            placeholder="Enter Access Code" 
            className="w-full bg-slate-800 border border-white/10 text-white p-3 rounded-lg text-center tracking-widest"
          />
          
          <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition">
            Unlock Dashboard
          </button>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  )
}