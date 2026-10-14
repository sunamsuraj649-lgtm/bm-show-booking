import React, { useEffect, useState } from 'react'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('bm_token')
        if (!token) return setStatus('not logged in')
        const res = await fetch('http://localhost:4000/api/mybookings', { headers: { Authorization: 'Bearer ' + token } })
        if (!res.ok) return setStatus('failed to load')
        const data = await res.json()
        setBookings(data)
      } catch (err) {
        setStatus('network error')
      }
    }
    load()
  }, [])

  if (status) return <div>{status}</div>
  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.length === 0 && <div>No bookings yet</div>}
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>{b.title} — {new Date(b.created_at).toLocaleString()} — {b.seats} seats</li>
        ))}
      </ul>
    </div>
  )
}
