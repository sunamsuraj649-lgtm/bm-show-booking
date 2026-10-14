import React, { useState } from 'react'

export default function AuthForm({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('login')
  const [status, setStatus] = useState(null)

  async function submit(e) {
    e.preventDefault()
    const url = mode === 'login' ? '/api/login' : '/api/register'
    try {
      const res = await fetch('http://localhost:4000' + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      const data = await res.json()
      if (!res.ok) return setStatus(data.error || 'error')
      localStorage.setItem('bm_token', data.token)
      onAuth && onAuth(data.token)
    } catch (err) {
      setStatus('network error')
    }
  }

  return (
    <form onSubmit={submit} className="auth-box">
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      </div>

      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      </div>

      {mode === 'register' && (
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        </div>
      )}

      <div className="auth-actions">
        <button className="login-btn" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
        <button className="switch-btn" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </div>

      {status && <div style={{ marginTop: 8, color: '#d32f2f' }}>{status}</div>}
    </form>
  )
}
