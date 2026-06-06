// src/engine/parseDocument.ts
import type { DocNode } from '../types'

export function parseDocument(raw: string): DocNode[] {
  const nodes: DocNode[] = []
  const paras = raw.split(/\n\n+/)
  for (const p of paras) {
    const t = p.trim()
    if (!t) continue
    if (t.startsWith('## ')) {
      nodes.push({ type: 'chapter', text: t.slice(3) })
    } else if (t === '* * *' || t === '***') {
      nodes.push({ type: 'scenebreak', text: '* * *' })
    } else if (t.startsWith('> ')) {
      nodes.push({ type: 'pullquote', text: t.slice(2) })
    } else {
      nodes.push({ type: 'paragraph', text: t })
    }
  }
  return nodes
}
