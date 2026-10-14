import React, { useState } from 'react'
import Button from '../../../../shared/ui/Button/Button'

export default function BookingForm({ show, onClose, token }) {
  const [name, setName] = useState('')
  const [seats, setSeats] = useState(1)
  const [status, setStatus] = useState(null)

  async function submit(e) {
    e.preventDefault()

    if (!token) {
      setStatus('Please login first to book tickets.')
      return
    }

    try {
      const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
      const res = await fetch('http://localhost:4000/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify({ show_id: show.id, name, seats })
      })
      const data = await res.json()
      if (res.ok) setStatus('Booked id: ' + data.id)
      else setStatus('Error: ' + (data.error || res.statusText))
    } catch (err) {
      setStatus('Network error')
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'grid', placeItems: 'center' }}>
      <form onSubmit={submit} style={{ background: '#fff', padding: 20, borderRadius: 8, minWidth: 320 }}>
        <h2>Book: {show.title}</h2>

        {!token ? (
          <div style={{ marginBottom: 16, color: '#d32f2f', fontWeight: 700 }}>
            Please login to continue booking.
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>
              <label>Name</label>
              <br />
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Seats</label>
              <br />
              <input type="number" min={1} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          {token && <Button type="submit">Confirm</Button>}
          <Button onClick={onClose} style={{ background: '#eee' }}>Close</Button>
        </div>

        {status && <div style={{ marginTop: 8 }}>{status}</div>}
      </form>
    </div>
  )
}
