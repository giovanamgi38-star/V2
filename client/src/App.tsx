import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you for joining the waitlist!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Failed to connect to the server.')
    }
  }

  return (
    <div className="hero-container">
      <header>
        <img src="/logo.png" alt="Syntropy Logo" className="logo" />
      </header>

      <main className="content-wrapper">
        <section className="text-section">
          <h1 className="tagline">
            The first fusion of Saju, Tarot, Numerology & Oracle — in one PDF
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Unlock your cosmic blueprint with an instantly generated, beautifully synthesized reading.
          </p>
        </section>

        <section className="form-box">
          <h2>Join the Waitlist</h2>
          <p>Be the first to know when we launch and get an exclusive early-bird offer.</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </div>
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
            </button>
          </form>
          {message && (
            <div className={`message ${status}`}>
              {message}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
