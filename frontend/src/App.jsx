import React, { useEffect, useState } from 'react'
import ShowCard from './entities/Show/ui/ShowCard/ShowCard'
import BookingForm from './features/Booking/ui/BookingForm/BookingForm'
import AuthForm from './features/Auth/ui/AuthForm/AuthForm'
import MyBookings from './features/Account/ui/MyBookings/MyBookings'

const posterColors = ['#f26b38', '#d32f2f', '#f4b400', '#6d4c41', '#1e88e5', '#43a047']
const cityOptions = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Pune']

export default function App() {
  const [shows, setShows] = useState([])
  const [selected, setSelected] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('bm_token'))
  const [view, setView] = useState('list')
  const [city, setCity] = useState(() => localStorage.getItem('bm_city') || 'Hyderabad')

  useEffect(() => {
    localStorage.setItem('bm_city', city)
  }, [city])

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:4000/api/shows')
      .then((r) => r.json())
      .then(setShows)
      .catch(console.error)
  }, [token])

  function handleAuth(newToken) {
    setToken(newToken)
    if (newToken) localStorage.setItem('bm_token', newToken)
    else localStorage.removeItem('bm_token')
  }

  if (!token) {
    return (
      <div className="login-page-shell">
        <div className="login-panel">
          <div className="login-brand-row">
            <span className="login-brand">BM Show</span>
            <select className="login-city-select" value={city} onChange={(e) => setCity(e.target.value)}>
              {cityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <AuthForm onAuth={handleAuth} />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand">BM Show</div>
          <select className="city-select" value={city} onChange={(e) => setCity(e.target.value)}>
            {cityOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="top-actions">
          <button className="ghost-btn" onClick={() => setView('mybookings')}>My Bookings</button>
          <button className="ghost-btn" onClick={() => { handleAuth(null); setView('list') }}>Logout</button>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div>
            <p className="eyebrow">Book tickets for the best experiences</p>
            <h1>Movie tickets made easy</h1>
            <p className="hero-subtitle">Enjoy the best movies in {city} today</p>
          </div>
          <div className="hero-actions">
            <button className="primary-btn">Now Showing</button>
            <button className="secondary-btn">Coming Soon</button>
          </div>
        </section>

        {view === 'list' && (
          <section className="shows-section">
            <div className="section-head">
              <h2>Recommended Movies</h2>
              <span>See all</span>
            </div>

            <div className="movie-grid">
              {shows.map((show, index) => (
                <ShowCard
                  key={show.id}
                  show={show}
                  posterColor={posterColors[index % posterColors.length]}
                  onBook={() => setSelected(show)}
                />
              ))}
            </div>
          </section>
        )}

        {view === 'mybookings' && <MyBookings />}

        {selected && (
          <BookingForm show={selected} onClose={() => setSelected(null)} token={token} />
        )}
      </main>
    </div>
  )
}
