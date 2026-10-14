import React from 'react'
import Button from '../../../../shared/ui/Button/Button'

export default function ShowCard({ show, onBook, posterColor }) {
  return (
    <article className="movie-card">
      <div className="poster" style={{ background: posterColor || '#f84464' }}>
        {show.title.slice(0, 2).toUpperCase()}
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{show.title}</h3>
        <p className="meta-line">{show.venue} — {new Date(show.time).toLocaleString()}</p>

        <div className="price-row">
          <span className="price-text">₹{Number(show.price || 0).toFixed(2)}</span>
          <Button className="book-btn" onClick={onBook}>Book</Button>
        </div>
      </div>
    </article>
  )
}
