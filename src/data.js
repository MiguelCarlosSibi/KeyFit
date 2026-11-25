export function checkKeycaps(kb, cap) {
  if (cap.kind === 'scissor') return { fits: false, why: 'Scissor-switch keycaps do not fit mechanical switches' }
  if ((cap.kind === 'low') !== kb.low) return { fits: false, why: kb.low ? 'This board needs low-profile keycaps' : 'Low-profile keycaps will not sit on standard MX switches' }
  return { fits: true, why: `${cap.name} (${cap.height} mm) fits this board` }
}

export function checkSwitch(kb, sw) {
  const magnetic = kb.socket === 'magnetic'
  if (magnetic !== (sw.kind === 'magnetic')) return { fits: false, why: magnetic ? 'This board only takes magnetic switches' : 'Magnetic switches need a Hall-effect board' }
  if ((sw.kind === 'low') !== kb.low) return { fits: false, why: kb.low ? 'This board needs low-profile switches' : 'Low-profile switches will not fit this plate' }
  if (kb.socket === '3-pin solder' && sw.pins === 5) return { fits: false, why: '5-pin switch needs clipped legs on a 3-pin board' }
  return { fits: true, why: `Fits ${kb.socket} cleanly` }
}

const find = (list, id) => list.find((i) => i.id === id)

export function evaluate(b, catalog) {
  const kb = b.keyboard ?? find(catalog.keyboards, b.keyboardId)
  const cap = find(catalog.keycaps, b.keycapId)
  const sw = find(catalog.switches, b.switchId)
  const capFit = cap && checkKeycaps(kb, cap)
  const swFit = sw && checkSwitch(kb, sw)
  return { kb, cap, sw, capFit, swFit, ok: Boolean(capFit?.fits && swFit?.fits) }
}