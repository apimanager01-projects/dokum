'use client'

import { useEffect, useRef } from 'react'
import { createEditorController, type EditorController } from '@/lib/editor/controller'
import { EditorToolbar } from './EditorToolbar'

/**
 * React shell of the LaTeX editor (PRD #28, Approach C).
 *
 * React owns only the toolbar and the childless mount container below it.
 * The contenteditable surface is created and managed imperatively by the
 * editor controller — the reconciler never sees its subtree, so typing,
 * selection, and user-generated DOM can never be lost to a re-render.
 */
export function EditorShell() {
  const mountRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<EditorController | null>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const controller = createEditorController(mountRef.current)
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  return (
    <div className="latex-editor">
      <EditorToolbar controllerRef={controllerRef} />
      {/* Imperative mount point — must stay childless in JSX (see PRD #28). */}
      <div ref={mountRef} />
    </div>
  )
}
