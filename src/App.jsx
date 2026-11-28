import { useState, useEffect } from 'react'
import Auth from './components/Auth.jsx'
import Builder from './components/Builder.jsx'

// custom hook: state that survives a refresh
function useStored(key, initial) {
  const [value, setValue] = useState(() => JSON.parse(localStorage.getItem(key)) ?? initial)
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue]
}

const tabs = [
  ['dashboard', 'Dashboard'],
  ['builder', 'Profile builder'],
  ['saved', 'Saved boards'],
  ['account', 'Account'],
]

export default function App() {
  const [users, setUsers] = useStored('keyfit-users', [])
  const [email, setEmail] = useStored('keyfit-session', null)
  const [boards, setBoards] = useStored('keyfit-boards', [])
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

  const user = users.find((u) => u.email === email)
  if (!user) {
    return (
      <Auth
        users={users}
        onLogin={setEmail}
        onSignUp={(u) => {
          setUsers([...users, u])
          setEmail(u.email)
        }}
      />
    )
  }
  if (loadError) return <p className="p-8 text-[#d09a8e]">{loadError}</p>
  if (!catalog) return <p className="p-8 text-[#9a968c]">Loading parts...</p>

  const mine = boards.filter((b) => b.owner === email)

  function saveBoard(board) {
    setBoards([...boards, { ...board, id: crypto.randomUUID(), owner: email }])
    setPage('saved')
  }

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
              {text}{id === 'saved' ? ` (${mine.length})` : ''}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm text-[#9a968c]">
          <span>{user.fullName}</span>
          <button type="button" onClick={() => setEmail(null)} className="cursor-pointer underline">Log out</button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-8 py-10">
        {page === 'builder' ? (
          <Builder catalog={catalog} onSave={saveBoard} />
        ) : (
          <p className="text-[#9a968c]">{page} page. This screen comes in the next step.</p>
        )}
      </main>
    </div>
  )
}