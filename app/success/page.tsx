import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const bookingId = searchParams.booking_id

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
      <div className="bg-slate-900 border border-white/10 p-10 rounded-2xl text-center max-w-lg">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Payment Successful</h1>
        <p className="text-gray-400 text-lg mb-8">
          Your booking has been secured. A confirmation email has been sent.
          <br />
          <span className="text-sm text-gray-600">Reference ID: {bookingId}</span>
        </p>
        
        <Link 
          href="/"
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}