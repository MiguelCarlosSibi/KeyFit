import { useState } from 'react'
import { evaluate } from '../data.js'
import { card, input, btn, label } from '../ui.js'

export function Dashboard({ user, boards, catalog, go }) {
  const rigs = boards.map((b) => evaluate(b, catalog))
  const latest = boards[boards.length - 1]
  const stats = [
    ['Saved boards', boards.length],
    ['Compatible rigs', `${rigs.filter((r) => r.ok).length} / ${boards.length}`],
    ['Latest board', latest ? latest.name : 'None yet'],
  ]

  return (
    <div className="grid gap-6">
      <section className={`${card} flex items-center justify-between gap-4`}>
        <div>
          <p className="text-sm text-[#9a968c]">@{user.username}</p>
          <h2 className="text-3xl font-semibold">Welcome back, {user.fullName}</h2>
          <p className="mt-1 text-[#9a968c]">Pick a board, then check that the keycaps and switches fit.</p>
        </div>
        <button type="button" onClick={() => go('builder')} className={btn}>Build a new board</button>
      </section>
      <ul className="grid grid-cols-3 gap-4">
        {stats.map(([name, value]) => (
          <li key={name} className={card}>
            <p className="text-sm text-[#9a968c]">{name}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Saved({ boards, catalog, onDelete, go }) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Saved boards</h2>
      {boards.length === 0 && (
        <p className="text-[#9a968c]">
          No saved boards yet.{' '}
          <button type="button" onClick={() => go('builder')} className="cursor-pointer text-[#a8bca3] underline">
            Build your first one
          </button>
        </p>
      )}
      <ul className="grid gap-4 md:grid-cols-2">
        {boards.map((b) => {
          const r = evaluate(b, catalog)
          return (
            <li key={b.id} className={card}>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{b.name}</h3>
                <button
                  type="button"
                  onClick={() => onDelete(b.id)}
                  className="cursor-pointer text-[#9a968c] hover:text-[#d09a8e]"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 text-sm text-[#9a968c]">
                {r.kb.name}, {r.cap?.name ?? 'removed keycaps'}, {r.sw?.name ?? 'removed switches'}
              </p>
              <p className={`mt-3 text-sm ${r.ok ? 'text-[#a8bca3]' : 'text-[#d09a8e]'}`}>
                {r.ok
                  ? 'All parts fit'
                  : r.capFit && !r.capFit.fits
                    ? r.capFit.why
                    : r.swFit?.why ?? 'Parts no longer in the catalog'}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Account({ user, onUpdate, onLogout }) {
  const [form, setForm] = useState({ fullName: user.fullName, username: user.username, layout: user.layout })
  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSaved(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    onUpdate(form)
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} className={`${card} grid max-w-md gap-4`}>
      <h2 className="text-2xl font-semibold">Account</h2>
      <p className="text-sm text-[#9a968c]">{user.email}</p>
      <div>
        <label htmlFor="fullName" className={label}>Full name</label>
        <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required className={input} />
      </div>
      <div>
        <label htmlFor="username" className={label}>Username</label>
        <input id="username" name="username" value={form.username} onChange={handleChange} required className={input} />
      </div>
      <div>
        <label htmlFor="layout" className={label}>Layout</label>
        <select id="layout" name="layout" value={form.layout} onChange={handleChange} className={input}>
          <option>ANSI</option>
          <option>ISO</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className={btn}>Save changes</button>
        <button type="button" onClick={onLogout} className="cursor-pointer text-[#9a968c] underline">Log out</button>
        {saved && <span className="text-sm text-[#a8bca3]">Saved</span>}
      </div>
    </form>
  )
}