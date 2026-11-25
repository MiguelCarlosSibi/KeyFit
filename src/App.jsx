import { useState, useEffect } from 'react'

const tabs = [
  ['dashboard', 'Dashboard'],
  ['builder', 'Profile builder'],
  ['saved', 'Saved boards'],
  ['account', 'Account'],
]

export default function App() {
  const [catalog, setCatalog] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [page, setPage] = useState('dashboard')

  useEffect(() => {
    fetch('/data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load the parts data.')
        return res.json()
      })
      .then(setCatalog)
      .catch((err) => setLoadError(err.message))
  }, [])

  if (loadError) return <p className="p-8 text-[#d09a8e]">{loadError}</p>
  if (!catalog) return <p className="p-8 text-[#9a968c]">Loading parts...</p>

  return (
    <div className="min-h-screen bg-[#1f2022] text-[#e8e4dc]">
      <header className="flex items-center justify-between border-b border-[#3a3d41] px-8 py-4">
        <h1 className="text-xl font-semibold tracking-tight">KeyFit</h1>
        <nav className="flex gap-1">
          {tabs.map(([id, text]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPage(id)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm ${
                page === id ? 'bg-[#8fa58a] text-[#1f2022]' : 'text-[#9a968c] hover:text-[#e8e4dc]'
              }`}
            >
              {text}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-8 py-10">
        <p className="text-[#9a968c]">
          {page} page. Loaded {catalog.keyboards.length} keyboards, {catalog.keycaps.length} keycap profiles and{' '}
          {catalog.switches.length} switches.
        </p>
      </main>
    </div>
  )
}