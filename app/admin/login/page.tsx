'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/lib/theme'

const MAX_ATTEMPTS = 5
const LOCKOUT_MS   = 60_000  // 1 minute

export default function AdminLoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const next         = searchParams.get('next') ?? '/admin/blog'
  const { isDark }   = useTheme()

  const [password,  setPassword]  = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [attempts,  setAttempts]  = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Countdown timer when locked out
  useEffect(() => {
    if (!lockedUntil) return
    const tick = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setLockedUntil(null)
        setAttempts(0)
        setCountdown(0)
        clearInterval(tick)
      } else {
        setCountdown(remaining)
      }
    }, 500)
    return () => clearInterval(tick)
  }, [lockedUntil])

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked || loading || !password.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res  = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      })
      const data = await res.json()

      if (res.ok) {
        // Successful login — redirect to intended destination
        router.push(next)
        router.refresh()
        return
      }

      // Failed attempt
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setPassword('')

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS
        setLockedUntil(until)
        setError(`Too many failed attempts. Try again in 60 seconds.`)
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts
        setError(
          data.error
            ?? `Incorrect password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`
        )
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-0)' }}
    >
      {/* Header */}
      <header
        className="border-b nav-blur"
        style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg-0) 90%, transparent)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/">
            <Logo height={34} variant={isDark ? 'dark' : 'light'} />
          </a>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center border"
              style={{
                background:   'linear-gradient(135deg, rgba(43,233,240,0.10), rgba(252,33,209,0.08))',
                borderColor:  'var(--border-b)',
              }}
            >
              <Lock className="w-7 h-7" style={{ color: 'var(--cyan)' }} strokeWidth={1.5} />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--tx-0)' }}>
              Admin Access
            </h1>
            <p className="font-mono text-xs" style={{ color: 'var(--tx-3)' }}>
              MuchaTech · Blog Management
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl border p-7"
            style={{ backgroundColor: 'var(--bg-1)', borderColor: 'var(--border)' }}
          >
            {/* Terminal chrome */}
            <div className="flex items-center gap-1.5 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
              <span className="font-mono text-xs ml-2" style={{ color: 'var(--tx-3)' }}>
                admin_login.sh
              </span>
            </div>

            {/* Error / lockout banner */}
            {error && (
              <div
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5 border"
                style={{
                  backgroundColor: isLocked ? 'rgba(252,33,209,0.06)' : 'rgba(252,33,209,0.05)',
                  borderColor:     'rgba(252,33,209,0.25)',
                }}
              >
                <ShieldAlert
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: '#FC21D1' }}
                  strokeWidth={1.5}
                />
                <div>
                  <p className="font-mono text-xs" style={{ color: '#FC21D1' }}>{error}</p>
                  {isLocked && countdown > 0 && (
                    <p className="font-mono text-xs mt-1" style={{ color: 'var(--tx-3)' }}>
                      {countdown}s remaining
                    </p>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password field */}
              <div>
                <label
                  className="block font-mono text-xs uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--tx-3)' }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter admin password…"
                    disabled={isLocked || loading}
                    autoFocus
                    autoComplete="current-password"
                    className="w-full pr-10 font-mono text-sm rounded-xl px-4 py-3 border outline-none transition-colors disabled:opacity-40"
                    style={{
                      backgroundColor: 'var(--bg-0)',
                      borderColor:     'var(--border)',
                      color:           'var(--tx-0)',
                    }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--tx-3)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--tx-1)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--tx-3)')}
                  >
                    {showPw
                      ? <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                      : <Eye    className="w-4 h-4" strokeWidth={1.5} />
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLocked || loading || !password.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed glow-cyan"
                style={{ background: 'var(--grad)', color: 'var(--bg-0)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying…
                  </>
                ) : isLocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Locked — wait {countdown}s
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Attempt indicator dots */}
            {attempts > 0 && !isLocked && (
              <div className="flex items-center justify-center gap-1.5 mt-5">
                {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-colors"
                    style={{ backgroundColor: i < attempts ? '#FC21D1' : 'var(--border-b)' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Back link */}
          <p className="text-center mt-6 font-mono text-xs" style={{ color: 'var(--tx-3)' }}>
            <a
              href="/"
              className="transition-colors"
              style={{ color: 'var(--tx-3)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--cyan)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--tx-3)')}
            >
              ← Back to site
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
