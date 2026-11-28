import { useState } from 'react'
import { card, input, btn, label } from '../ui.js'

const empty = { fullName: '', username: '', email: '', layout: 'ANSI', password: '', confirm: '' }

export default function Auth({ users, onLogin, onSignUp }) {
  const [signUp, setSignUp] = useState(true)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const email = form.email.trim().toLowerCase()
    const existing = users.find((u) => u.email === email)
    if (!signUp) {
      if (!existing || existing.password !== form.password) return setError('Email or password is incorrect.')
      return onLogin(email)
    }
    if (existing) return setError('That email already has an account. Log in instead.')
    if (form.password.length < 8) return setError('Use at least 8 characters for your password.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    onSignUp({
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email,
      layout: form.layout,
      password: form.password,
    })
  }

  const field = (name, text, type = 'text', placeholder = '') => (
  <div>
    <label htmlFor={name} className={label}>{text}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
      required
      autoComplete={type === 'password' ? (signUp ? 'new-password' : 'current-password') : 'off'}
      className={input}
    />
  </div>
)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1f2022] px-4 text-[#e8e4dc]">
      <form onSubmit={handleSubmit} className={`${card} grid w-full max-w-md gap-4`}>
        <h1 className="text-2xl font-semibold">{signUp ? 'Create your KeyFit account' : 'Log in to KeyFit'}</h1>
        <p className="text-sm text-[#9a968c]">Save your keyboard builds and check that every part fits before you buy.</p>
        {signUp && field('fullName', 'Full name')}
        {signUp && field('username', 'Username', 'text', 'keycapfan')}
        {field('email', 'Email', 'email')}
        {signUp && (
          <div>
            <label htmlFor="layout" className={label}>Layout</label>
            <select id="layout" name="layout" value={form.layout} onChange={handleChange} className={input}>
              <option>ANSI</option>
              <option>ISO</option>
            </select>
          </div>
        )}
        {field('password', 'Password', 'password')}
        {signUp && field('confirm', 'Confirm password', 'password')}
        {error && <p className="text-sm text-[#d09a8e]">{error}</p>}
        <button type="submit" className={btn}>{signUp ? 'Create account' : 'Log in'}</button>
        <button
  type="button"
  onClick={() => {
    setSignUp(!signUp)
    setForm(empty)
    setError('')
  }}
  className="cursor-pointer text-sm text-[#a8bca3] underline"
>
  {signUp ? 'Already have an account? Log in' : 'New here? Create an account'}
</button>
      </form>
    </div>
  )
}