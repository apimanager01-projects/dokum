'use client'

/**
 * PROTOTYPE (#117) — real MathJax, not a stand-in. Throwaway.
 *
 * #116's prototype faked the formula with a serif italic, which was fine for
 * judging spacing and weight. It is NOT fine here: this ticket says the
 * body/maths pairing "can only be judged by rendering it", and the thing the
 * body face has to sit beside is MathJax's actual output — Computer Modern
 * drawn as SVG paths, which is lighter and higher-contrast than almost any
 * screen face. So this goes through the same loader the editor and the student
 * viewer use, at the same settings.
 */

import { useEffect, useRef } from 'react'
import { loadMathJax } from '@/lib/editor/mathjax-loader'

export function Formula({ tex, display = false }: { tex: string; display?: boolean }) {
  const host = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let dead = false
    loadMathJax()
      .then((mj) => mj.tex2svgPromise(tex, { display }))
      .then((node) => {
        if (dead || !host.current) return
        host.current.replaceChildren(node)
      })
      .catch(() => {
        if (host.current) host.current.textContent = tex
      })
    return () => {
      dead = true
    }
  }, [tex, display])

  return <span ref={host} style={display ? { display: 'block' } : { display: 'inline-block' }} />
}
