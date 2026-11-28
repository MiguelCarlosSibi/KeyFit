import { useState } from 'react'
import { evaluate } from '../data.js'
import { card, input, btn, label } from '../ui.js'

const Chip = ({ r }) =>
  r && (
    <span className={`rounded-full px-3 py-1 text-xs ${r.fits ? 'bg-[#8fa58a]/20 text-[#a8bca3]' : 'bg-[#b5776a]/20 text-[#d09a8e]'}`}>
      {r.fits ? 'Fits' : 'Does not fit'}
    </span>
  )

export default function Builder({ catalog, onSave }) {
  const { keyboards, keycaps, switches } = catalog
  const [pick, setPick] = useState({ keyboardId: keyboards[0].id, keycapId: '', switchId: '' })
  const [name, setName] = useState('')
  const [custom, setCustom] = useState([])
  const [spec, setSpec] = useState({ name: '', size: '75%', layout: 'ANSI', socket: '5-pin hot-swap', low: false })

  const allKeyboards = [...keyboards, ...custom]
  const r = evaluate({ ...pick, keyboard: allKeyboards.find((k) => k.id === pick.keyboardId) }, catalog)
  const tint = !r.capFit ? 'bg-[#3a3d41]' : r.capFit.fits ? 'bg-[#8fa58a]' : 'bg-[#b5776a]'

  function handleChange(e) {
    setPick({ ...pick, [e.target.name]: e.target.value })
  }

  function handleSpec(e) {
    const { name, value, type, checked } = e.target
    setSpec({ ...spec, [name]: type === 'checkbox' ? checked : value })
  }

  function addKeyboard(e) {
    e.preventDefault()
    if (!spec.name.trim()) return
    const k = { ...spec, name: spec.name.trim(), id: crypto.randomUUID() }
    setCustom([...custom, k])
    setPick({ ...pick, keyboardId: k.id })
    setSpec({ ...spec, name: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !pick.keycapId || !pick.switchId) return
    onSave({ ...pick, keyboard: r.kb, name: name.trim() })
  }

  const select = (field, text, list, result) => (
    <div className={card}>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={field} className="font-medium">{text}</label>
        <Chip r={result} />
      </div>
      <select id={field} name={field} value={pick[field]} onChange={handleChange} className={input}>
        <option value="">Choose one</option>
        {list.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}{i.height ? ` (${i.height} mm)` : ''}
          </option>
        ))}
      </select>
      {result && <p className="mt-2 text-sm text-[#9a968c]">{result.why}</p>}
    </div>
  )

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
      <div className="grid content-start gap-4">
        <div className={card}>
          <p className="mb-3 font-medium">1. Pick a base keyboard</p>
          <ul className="grid grid-cols-2 gap-2">
            {allKeyboards.map((k) => (
              <li key={k.id}>
                <button
                  type="button"
                  onClick={() => setPick({ ...pick, keyboardId: k.id })}
                  className={`w-full cursor-pointer rounded-lg border p-3 text-left ${
                    pick.keyboardId === k.id ? 'border-[#8fa58a] bg-[#8fa58a]/10' : 'border-[#3a3d41] hover:border-[#9a968c]'
                  }`}
                >
                  <span className="block font-medium">{k.name}</span>
                  <span className="text-sm text-[#9a968c]">{k.size} {k.layout}, {k.socket}</span>
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addKeyboard} className="mt-4 grid gap-3 border-t border-[#3a3d41] pt-4">
            <p className="text-sm text-[#9a968c]">Not listed? Add any keyboard</p>
            <input name="name" value={spec.name} onChange={handleSpec} placeholder="Keyboard name" className={input} />
            <div className="grid grid-cols-2 gap-2">
              <select name="size" value={spec.size} onChange={handleSpec} className={input}>
               {['60%', '65%', '75%', 'TKL'].map((s) => <option key={s}>{s}</option>)}
              </select>
              <select name="layout" value={spec.layout} onChange={handleSpec} className={input}>
                <option>ANSI</option>
                <option>ISO</option>
              </select>
              <select name="socket" value={spec.socket} onChange={handleSpec} className={input}>
                {['5-pin hot-swap', '3-pin solder', 'magnetic'].map((s) => <option key={s}>{s}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm text-[#9a968c]">
                <input type="checkbox" name="low" checked={spec.low} onChange={handleSpec} /> Low profile
              </label>
            </div>
            <button type="submit" className={btn}>Add keyboard</button>
          </form>
        </div>
        {select('keycapId', '2. Choose a keycap profile', keycaps, r.capFit)}
        {select('switchId', '3. Choose key switches', switches, r.swFit)}
      </div>

      <form onSubmit={handleSubmit} className={`${card} grid content-start gap-4`}>
        <h2 className="text-lg font-semibold">{r.kb.name}</h2>
        <ul className="grid grid-cols-8 gap-1" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => <li key={i} className={`h-6 rounded ${tint}`} />)}
        </ul>
        <p className="text-sm text-[#9a968c]">
          {r.kb.size} {r.kb.layout}, {r.kb.socket}{r.kb.low ? ', low profile' : ''}
        </p>
        <p className="font-medium">
          {!r.cap || !r.sw
            ? 'Choose keycaps and switches to see the verdict.'
            : r.ok
              ? 'All parts fit this board.'
              : 'Some parts do not fit this board.'}
        </p>
        <div>
          <label htmlFor="name" className={label}>Board name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Daily driver" className={input} />
        </div>
        <button type="submit" disabled={!name.trim() || !r.cap || !r.sw} className={btn}>
          Save keyboard profile
        </button>
      </form>
    </div>
  )
}