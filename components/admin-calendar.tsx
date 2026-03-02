'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import {format} from 'date-fns/format'
import {parse} from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import {getDay} from 'date-fns/getDay'
import {enUS} from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css' 
import './calendar-override.css' 
import { useState } from 'react'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Define the shape of the data coming from Supabase
type Booking = {
  id: string
  customer_name: string
  booking_type: string
  status: string
  duration: string // Postgres range string: '["2024-01-01","2024-01-02")'
}

export default function AdminCalendar({ bookings }: { bookings: Booking[] }) {
  // 1. Transform Data: Postgres String -> JS Date Object
  const events = bookings.map((b) => {
    // Clean the string: remove [ ) " and split by comma
    const [startStr, endStr] = b.duration.replace(/[\[\)""]/g, '').split(',')
    
    return {
      id: b.id,
      title: `${b.customer_name} (${b.booking_type})`,
      start: new Date(startStr),
      end: new Date(endStr),
      resource: b, // Keep full data attached
    }
  })

  // 2. Event Styler: Color code based on status
  const eventStyleGetter = (event: any) => {
    const status = event.resource.status
    let backgroundColor = '#374151' // Default Gray

    if (status === 'confirmed') backgroundColor = '#10b981' // Emerald
    if (status === 'pending') backgroundColor = '#f59e0b' // Amber
    if (status === 'cancelled') backgroundColor = '#ef4444' // Red

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }

  return (
    <div className="h-[600px] bg-slate-900 border border-white/10 rounded-xl p-6 shadow-2xl">
      <h3 className="text-xl font-serif font-bold text-white mb-6">Visual Schedule</h3>
      <div className="h-[500px] text-gray-200">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'agenda']}
          defaultView='month'
          popup // Show full details on click
        />
      </div>
    </div>
  )
}