'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Eye, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  createLesson,
  deleteDocument,
  deleteUnit,
  reorderLessons,
  scanDocumentBacklinks,
  setKursPublished,
} from '@/actions/admin'
import { backlinkDeleteWarning, backlinkScanFailedWarning } from '@/lib/editor/backlinks'
import type {
  AdminKursWorkspace,
  AdminKursWorkspaceDocument,
  AdminKursWorkspaceTask,
  AdminKursWorkspaceUnit,
} from '@/lib/dal'
import { LESSON_TASK_TITLE } from '@/lib/lessons/lesson-task'
import {
  formatLessonNumber,
  lessonNumberPath,
  unitNumberPath,
} from '@/lib/lessons/lesson-meta'
import {
  LessonEditor,
  type LessonEditorPage,
  type LessonEditorPreview,
} from '@/components/lessons/LessonEditor'
import { DocumentForm } from './DocumentForm'
import { KursForm } from './KursForm'
import { TaskForm } from './TaskForm'
import { UnitForm } from './UnitForm'

type Selection =
  | { kind: 'kurs' }
  | { kind: 'new-unit' }
  | { kind: 'unit'; id: string }
  | { kind: 'new-task'; unitId: string }
  | { kind: 'task'; id: string }
  | { kind: 'new-document'; taskId: string }
  | { kind: 'document'; id: string }
  | { kind: 'new-lesson'; unitId: string }
  | { kind: 'lesson'; id: string }

/**
 * The course-wide admin workspace: the public course shell's stable sidebar,
 * but with authoring actions instead of reader navigation. Every editor in the
 * main column reuses the existing server actions and forms, so this page is a
 * new workflow over the same write boundaries rather than a second CRUD stack.
 */
export function KursManageWorkspace({
  kurs,
  initialLesson,
}: {
  kurs: AdminKursWorkspace
  initialLesson?: LessonEditorPage
}) {
  const router = useRouter()
  const [selection, setSelection] = useState<Selection>(
    initialLesson ? { kind: 'lesson', id: initialLesson.id } : { kind: 'kurs' }
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const [published, setPublished] = useState(kurs.published)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishPending, startPublishTransition] = useTransition()
  const [deletePending, startDeleteTransition] = useTransition()
  const [treeError, setTreeError] = useState<string | null>(null)
  const branchUnitId = selectedUnitId(kurs, selection)

  /**
   * Deleting an Einheit takes its Aufgaben, Dokumente and Lernseiten with it —
   * the cascade the server action already performs. The confirm spells that out
   * rather than asking „sicher?", because the row in the tree shows a title and
   * gives no hint of how much hangs below it.
   */
  function removeUnit(unit: AdminKursWorkspaceUnit) {
    const confirmed = window.confirm(
      `Einheit „${unit.title}" und alle zugehörigen Inhalte wirklich löschen?`
    )
    if (!confirmed) return
    setTreeError(null)
    startDeleteTransition(async () => {
      const result = await deleteUnit(unit.id)
      if (!result.ok) {
        setTreeError(result.error)
        return
      }
      // The selection may have been pointing INTO what was just deleted; the
      // Kurs itself is the only target guaranteed to still exist.
      setSelection({ kind: 'kurs' })
      router.refresh()
    })
  }

  /**
   * Deleting one Lernseite.
   *
   * ⚠ IT SCANS FOR BACKLINKS FIRST, like every other Dokument deletion in the
   * admin (#75). A Lernseite is a `documents` row, so an interactive document
   * elsewhere in the catalogue can link to it — and those links are not stored
   * anywhere, they are found by looking. Deleting without asking would turn a
   * live link into a dead one silently.
   *
   * A FAILED SCAN IS SAID OUT LOUD AND NEVER BLOCKS: „the check could not run"
   * must not masquerade as „nothing links here", and refusing the delete would
   * lock an author out of their own catalogue over a broken scan.
   */
  function removeLesson(lesson: AdminKursWorkspaceDocument) {
    setTreeError(null)
    startDeleteTransition(async () => {
      let warning: string | null = null
      try {
        const scan = await scanDocumentBacklinks(lesson.id)
        warning = scan.ok
          ? backlinkDeleteWarning(scan.data)
          : backlinkScanFailedWarning('diese Lernseite', scan.error)
      } catch {
        warning = backlinkScanFailedWarning('diese Lernseite')
      }

      const question = `Lernseite „${lesson.title}" wirklich löschen?`
      if (!window.confirm(warning ? `${warning}\n\n${question}` : question)) return

      const result = await deleteDocument(lesson.id)
      if (!result.ok) {
        setTreeError(result.error)
        return
      }
      // The editor on the right may have been showing exactly this page.
      setSelection((current) =>
        current.kind === 'lesson' && current.id === lesson.id ? { kind: 'kurs' } : current
      )
      router.refresh()
    })
  }

  /** Persists a drag. The tree re-reads from the server, so a failure simply undoes itself. */
  function persistLessonOrder(unitId: string, documentIds: string[]) {
    setTreeError(null)
    startDeleteTransition(async () => {
      const result = await reorderLessons(unitId, documentIds)
      if (!result.ok) setTreeError(result.error)
      router.refresh()
    })
  }

  function changePublished(next: boolean) {
    if (next === published) return
    setPublished(next)
    setPublishError(null)
    startPublishTransition(async () => {
      const result = await setKursPublished(kurs.id, next)
      if (result.ok) {
        router.refresh()
      } else {
        setPublished(!next)
        setPublishError(result.error)
      }
    })
  }

  return (
    <div className="-mx-4 bg-[#fffdf8] sm:-mx-8">
      {/* The line under the navbar. STICKY, not the container's `border-t`:
          a border at the top of a scrolling box scrolls away with the box, and
          the navbar above is `sticky` — so the moment the line left the
          viewport the header floated over the content with no edge at all.
          `top-[66px]` is the navbar's height (Navbar.tsx), and z-40 keeps it
          above the content it separates but under the navbar itself. */}
      <div aria-hidden className="sticky top-[66px] z-40 h-px bg-gray-200" />
      <div className="flex min-h-[calc(100svh-66px)] flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-gray-200 bg-[#faf8f3] lg:sticky lg:top-[66px] lg:h-[calc(100svh-66px)] lg:w-80 lg:self-start lg:overflow-y-auto lg:border-r lg:border-b-0">
          <div className="border-b border-black/5 px-5 py-5 lg:px-6 lg:py-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href="/admin/kurse"
                  className="text-xs font-semibold text-gray-500 transition-colors hover:text-brand"
                >
                  ← Kurse verwalten
                </Link>
                <h1 className="mt-3 truncate text-xl font-black text-black">{kurs.title}</h1>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                    {kurs.kurs_type === 'lernkurs' ? 'Lernkurs' : 'Musterlösungen'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen((open) => !open)}
                aria-expanded={mobileOpen}
                className="shrink-0 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 lg:hidden"
              >
                {mobileOpen ? 'Schließen' : 'Inhalt'}
              </button>
            </div>

            {/* A checkbox, like „Publish immediately" in KursForm — the app has
                never had a toggle switch, and the one here came from the
                component library. */}
            <div className="mt-5 rounded-xl border border-gray-200 bg-white shadow-sm">
              <label className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3">
                <span>
                  <span className="block text-xs font-medium text-gray-500">Sichtbarkeit</span>
                  <span
                    className={`mt-0.5 block text-sm font-semibold ${
                      published ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {published ? 'Veröffentlicht' : 'Privat'}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) => changePublished(event.target.checked)}
                  disabled={publishPending}
                  aria-label={published ? 'Kurs auf privat stellen' : 'Kurs veröffentlichen'}
                  className="h-4 w-4 shrink-0 rounded border-gray-300 accent-brand disabled:opacity-50"
                />
              </label>
              {publishError && (
                <p className="border-t border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                  {publishError}
                </p>
              )}
            </div>

            {/* The student's own page, in a new tab — not a rebuilt preview.
                An admin passes RLS, so this works while the Kurs is still
                private, and being the REAL page is the point: a second
                rendering could agree with the editor and still disagree with
                what a student gets. `rel` because `target="_blank"` otherwise
                hands the opened page a `window.opener` handle. */}
            <a
              href={`/kurse/${kurs.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <Eye className="size-4" />
              Kursvorschau
            </a>
          </div>

          <nav
            aria-label="Kurs bearbeiten"
            className={`px-3 py-4 lg:block lg:px-4 ${mobileOpen ? 'block' : 'hidden'}`}
          >
            <button
              type="button"
              onClick={() => {
                setSelection({ kind: 'kurs' })
                setMobileOpen(false)
              }}
              className={sidebarRow(selection.kind === 'kurs', 'font-bold')}
            >
              <Dot active={selection.kind === 'kurs'} />
              <span className="truncate">Kursdaten</span>
            </button>

            {treeError && (
              <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-600">
                {treeError}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between px-2">
              <p className="text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">
                Einheiten
              </p>
              <span className="text-[10px] font-semibold text-gray-400">{kurs.units.length}</span>
            </div>

            <ul className="mt-1 space-y-0.5">
              {kurs.units.map((unit, unitIndex) => {
                const active = branchUnitId === unit.id
                // An Einheit is numbered only once it holds Lernseiten — the
                // same rule the Einheit heading follows, so the tree and the
                // page cannot disagree about whether „1" exists.
                const unitLabel = formatLessonNumber(
                  unitNumberPath(unitIndex + 1, kurs.kurs_type === 'lernkurs')
                )
                return (
                  <li key={unit.id}>
                    {/* `group` so the delete button only appears on hover or
                        keyboard focus: it sits beside every Einheit, and a row
                        of permanent trash icons makes a tree look dangerous. */}
                    <div className="group flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelection({ kind: 'unit', id: unit.id })
                          setMobileOpen(false)
                        }}
                        className={`${sidebarRow(active, 'font-bold')} flex-1`}
                      >
                        <Dot active={active} />
                        {unitLabel && (
                          <span className="shrink-0 tabular-nums text-gray-400">{unitLabel}</span>
                        )}
                        <span className="truncate">{unit.title}</span>
                      </button>
                      <button
                        type="button"
                        disabled={deletePending}
                        onClick={() => removeUnit(unit)}
                        aria-label={`Einheit ${unit.title} löschen`}
                        title="Einheit löschen"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-3.5 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 />
                      </button>
                    </div>

                    {active && (
                      kurs.kurs_type === 'lernkurs' ? (
                        <LessonRows
                          kursId={kurs.id}
                          unit={unit}
                          unitNumber={unitIndex + 1}
                          selection={selection}
                          onAdd={() => {
                            setSelection({ kind: 'new-lesson', unitId: unit.id })
                            setMobileOpen(false)
                          }}
                          onNavigate={() => setMobileOpen(false)}
                          onReorder={(ids) => persistLessonOrder(unit.id, ids)}
                          onDelete={removeLesson}
                          deletePending={deletePending}
                        />
                      ) : (
                        <TaskRows
                          unit={unit}
                          selection={selection}
                          onAdd={() => {
                            setSelection({ kind: 'new-task', unitId: unit.id })
                            setMobileOpen(false)
                          }}
                          onSelect={(next) => {
                            setSelection(next)
                            setMobileOpen(false)
                          }}
                        />
                      )
                    )}
                  </li>
                )
              })}
            </ul>

            {kurs.units.length === 0 && (
              <p className="px-2 pt-3 text-xs text-gray-400">Noch keine Units.</p>
            )}

            {/* Below the list, where „add" belongs: the button sits at the end
                of the thing it extends, so the eye reaches the existing units
                first and the new one appears where the button already is. */}
            <button
              type="button"
              onClick={() => {
                setSelection({ kind: 'new-unit' })
                setMobileOpen(false)
              }}
              className="btn-brand mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
            >
              <Plus className="size-4" />
              Neue Unit
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className={`mx-auto ${selection.kind === 'lesson' ? 'max-w-6xl' : 'max-w-3xl'}`}>
            <WorkspacePanel kurs={kurs} selection={selection} initialLesson={initialLesson} />
          </div>
        </main>
      </div>
    </div>
  )
}

function TaskRows({
  unit,
  selection,
  onAdd,
  onSelect,
}: {
  unit: AdminKursWorkspaceUnit
  selection: Selection
  onAdd: () => void
  onSelect: (selection: Selection) => void
}) {
  const tasks = unit.tasks.filter((task) => task.title !== LESSON_TASK_TITLE)

  return (
    <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-gray-200 pl-2">
      {tasks.map((task) => {
        const active =
          (selection.kind === 'task' && selection.id === task.id) ||
          (selection.kind === 'new-document' && selection.taskId === task.id) ||
          (selection.kind === 'document' && task.documents.some((doc) => doc.id === selection.id))

        return (
          <li key={task.id}>
            {/* IN A MUSTERLÖSUNGS-KURS, OPENING AN UNTERKAPITEL MEANS UPLOADING
                INTO IT. That is the only thing anyone comes here to do: the
                Unterkapitel is a folder, and its own title and description are
                set once when it is created and almost never again. So the row
                goes straight to the upload form, and editing the Unterkapitel
                itself moved to the pencil beside it — the rarer action gets the
                smaller target, not the other way round.

                A Lernkurs never reaches this component; its Einheiten render
                LessonRows instead. */}
            <div className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelect({ kind: 'new-document', taskId: task.id })}
                className={`${sidebarRow(active, 'font-medium text-[13px]')} flex-1`}
              >
                <Dot active={active} muted />
                <span className="truncate">{task.title}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelect({ kind: 'task', id: task.id })}
                aria-label={`Unterkapitel ${task.title} bearbeiten`}
                title="Unterkapitel bearbeiten"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-3.5 hover:bg-gray-100 hover:text-gray-700"
              >
                <Pencil />
              </button>
            </div>

            {active && task.documents.length > 0 && (
              <ul className="ml-4 space-y-0.5 border-l border-gray-200 pl-2">
                {task.documents.map((doc) => (
                  <li key={doc.id}>
                    <button
                      type="button"
                      onClick={() => onSelect({ kind: 'document', id: doc.id })}
                      className={sidebarRow(
                        selection.kind === 'document' && selection.id === doc.id,
                        'font-medium text-xs'
                      )}
                    >
                      <Dot
                        active={selection.kind === 'document' && selection.id === doc.id}
                        muted
                      />
                      <span className="truncate">{doc.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
      <li>
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-gray-400 transition-colors hover:bg-black/[0.04] hover:text-brand"
        >
          <span aria-hidden="true" className="text-base leading-none">+</span>
          Aufgabe hinzufügen
        </button>
      </li>
    </ul>
  )
}

/** One draggable Lernseite row: a grip that drags, a link that navigates. */
function LessonRow({
  lesson,
  href,
  label,
  active,
  onNavigate,
  onDelete,
  deletePending,
}: {
  lesson: AdminKursWorkspaceDocument
  href: string
  label: string
  active: boolean
  onNavigate: () => void
  onDelete: () => void
  deletePending: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group flex items-center gap-1 ${isDragging ? 'z-10 opacity-70' : ''}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`${lesson.title} verschieben`}
        title="Verschieben"
        className="shrink-0 cursor-grab touch-none rounded p-0.5 text-gray-300 opacity-0 hover:text-gray-600 focus-visible:opacity-100 active:cursor-grabbing group-hover:opacity-100"
      >
        <GripVertical className="size-3.5" />
      </button>
      <Link
        href={href}
        onClick={onNavigate}
        className={`${sidebarRow(active, 'font-medium text-[13px]')} flex-1`}
      >
        <Dot active={active} muted />
        {label && <span className="shrink-0 tabular-nums text-gray-400">{label}</span>}
        <span className="truncate">{lesson.title}</span>
      </Link>
      <button
        type="button"
        disabled={deletePending}
        onClick={onDelete}
        aria-label={`Lernseite ${lesson.title} löschen`}
        title="Lernseite löschen"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-3.5 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 />
      </button>
    </li>
  )
}

function LessonRows({
  kursId,
  unit,
  unitNumber,
  selection,
  onAdd,
  onNavigate,
  onReorder,
  onDelete,
  deletePending,
}: {
  kursId: string
  unit: AdminKursWorkspaceUnit
  /** 1-based position of the Einheit in its Kurs — the first half of „1.2". */
  unitNumber: number
  selection: Selection
  onAdd: () => void
  onNavigate: () => void
  onReorder: (documentIds: string[]) => void
  onDelete: (lesson: AdminKursWorkspaceDocument) => void
  deletePending: boolean
}) {
  const serverLessons = unit.tasks
    .filter((task) => task.title === LESSON_TASK_TITLE)
    .flatMap((task) => task.documents.filter((doc) => doc.file_type === 'lesson'))

  const [lessons, setLessons] = useState(serverLessons)

  // Adopt the server's list whenever it actually changes — a page added or
  // deleted elsewhere, or a reorder that was refused. Compared by id sequence
  // rather than by array identity, which is new on every render.
  const serverKey = serverLessons.map((lesson) => lesson.id).join(',')
  const [lastServerKey, setLastServerKey] = useState(serverKey)
  if (serverKey !== lastServerKey) {
    setLastServerKey(serverKey)
    setLessons(serverLessons)
  }

  const sensors = useSensors(
    // A small distance threshold so a click is still a click: without it every
    // press on a row would start a drag and swallow the navigation.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function finishDrag({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const from = lessons.findIndex((lesson) => lesson.id === active.id)
    const to = lessons.findIndex((lesson) => lesson.id === over.id)
    if (from === -1 || to === -1) return
    const next = arrayMove(lessons, from, to)
    setLessons(next)
    onReorder(next.map((lesson) => lesson.id))
  }

  return (
    <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-gray-200 pl-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={finishDrag}>
        <SortableContext
          items={lessons.map((lesson) => lesson.id)}
          strategy={verticalListSortingStrategy}
        >
          {lessons.map((lesson, index) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              href={`/admin/kurse/${kursId}?lessonId=${lesson.id}`}
              // The SAME rule the page uses, from the same function — a
              // Lernseite is numbered only from the second one on, because a
              // lone page's number already sits on the Einheit heading.
              label={formatLessonNumber(lessonNumberPath(unitNumber, index, lessons.length))}
              active={selection.kind === 'lesson' && selection.id === lesson.id}
              onNavigate={onNavigate}
              onDelete={() => onDelete(lesson)}
              deletePending={deletePending}
            />
          ))}
        </SortableContext>
      </DndContext>
      <li>
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-gray-400 transition-colors hover:bg-black/[0.04] hover:text-brand"
        >
          <span aria-hidden="true" className="text-base leading-none">+</span>
          Lernseite hinzufügen
        </button>
      </li>
    </ul>
  )
}

function WorkspacePanel({
  kurs,
  selection,
  initialLesson,
}: {
  kurs: AdminKursWorkspace
  selection: Selection
  initialLesson?: LessonEditorPage
}) {
  const unit =
    selection.kind === 'unit' ? kurs.units.find((item) => item.id === selection.id) : undefined
  const task =
    selection.kind === 'task'
      ? kurs.units.flatMap((item) => item.tasks).find((item) => item.id === selection.id)
      : undefined
  const document =
    selection.kind === 'document'
      ? kurs.units
          .flatMap((item) => item.tasks)
          .flatMap((item) => item.documents)
          .find((item) => item.id === selection.id)
      : undefined
  const lesson =
    selection.kind === 'lesson' && initialLesson?.id === selection.id ? initialLesson : undefined
  const lessonPreview = lesson ? buildLessonPreview(kurs, lesson.id) : undefined
  const unitsForForm = kurs.units.map((item) => ({ ...item, kurse: { title: kurs.title } }))
  const tasksForForm = kurs.units.flatMap((item) =>
    item.tasks
      .filter((candidate) => candidate.title !== LESSON_TASK_TITLE)
      .map((candidate) => ({
        ...candidate,
        units: { ...item, kurse: { title: kurs.title } },
      }))
  )
  const heading = panelHeading(kurs, selection, unit, task, document, lesson)

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
      <header className="border-b border-gray-100 px-6 py-5 sm:px-8">
        <p className="text-[11px] font-bold tracking-[0.1em] text-gray-400 uppercase">
          {heading.eyebrow}
        </p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{heading.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{heading.description}</p>
          </div>
          {selection.kind === 'kurs' && (
            <Link
              href={`/kurse/${kurs.id}`}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              Kurs ansehen ↗
            </Link>
          )}
        </div>
      </header>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        {selection.kind === 'kurs' && (
          <KursForm
            key={kurs.id}
            editId={kurs.id}
            defaultValues={kurs}
          />
        )}

        {selection.kind === 'new-unit' && (
          <UnitForm
            key={`new-unit-${kurs.id}-${kurs.units.length}`}
            kurse={[kurs]}
            defaultKursId={kurs.id}
            defaultValues={{ title: '', description: null, position: kurs.units.length }}
          />
        )}

        {selection.kind === 'unit' && unit && (
          <UnitForm
            key={unit.id}
            kurse={[kurs]}
            defaultKursId={kurs.id}
            editId={unit.id}
            defaultValues={unit}
          />
        )}

        {selection.kind === 'new-task' && (
          <TaskForm
            key={`new-task-${selection.unitId}`}
            units={unitsForForm}
            defaultUnitId={selection.unitId}
            defaultValues={{ title: '', description: null, position: taskCount(kurs, selection.unitId) }}
          />
        )}

        {selection.kind === 'task' && task && (
          <TaskForm
            key={task.id}
            units={unitsForForm}
            defaultUnitId={task.unit_id}
            editId={task.id}
            defaultValues={task}
          />
        )}

        {selection.kind === 'new-document' && (
          <DocumentForm
            key={`new-document-${selection.taskId}`}
            tasks={tasksForForm}
            defaultTaskId={selection.taskId}
            defaultValues={{
              title: '',
              description: null,
              position: documentCount(kurs, selection.taskId),
            }}
          />
        )}

        {selection.kind === 'document' && document && (
          <DocumentForm
            key={document.id}
            tasks={tasksForForm}
            defaultTaskId={document.task_id}
            editId={document.id}
            defaultValues={document}
          />
        )}

        {selection.kind === 'new-lesson' && (
          <NewLessonForm
            key={`new-lesson-${selection.unitId}`}
            kursId={kurs.id}
            unit={kurs.units.find((item) => item.id === selection.unitId)}
          />
        )}

        {selection.kind === 'lesson' &&
          (lesson ? (
            <LessonEditor key={lesson.id} page={lesson} preview={lessonPreview} />
          ) : (
            <MissingSelection />
          ))}
      </div>
    </section>
  )
}

function NewLessonForm({
  kursId,
  unit,
}: {
  kursId: string
  unit: AdminKursWorkspaceUnit | undefined
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!unit) return <MissingSelection />

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!title.trim()) return
        const formData = new FormData()
        formData.set('unit_id', unit.id)
        formData.set('title', title.trim())
        startTransition(async () => {
          const result = await createLesson(formData)
          if (result.ok) {
            router.push(`/admin/kurse/${kursId}?lessonId=${result.data.documentId}`)
          } else {
            setError(result.error)
          }
        })
      }}
      className="flex flex-col gap-5"
    >
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Die neue Lernseite wird in <strong>{unit.title}</strong> angelegt und anschließend direkt
        hier im Kurs-Editor geöffnet.
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">
          Titel <span className="text-red-500">*</span>
        </span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          autoFocus
          className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-brand focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={pending || !title.trim()}
        className="btn-brand self-start rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? 'Wird angelegt…' : 'Lernseite anlegen'}
      </button>
    </form>
  )
}

function panelHeading(
  kurs: AdminKursWorkspace,
  selection: Selection,
  unit?: AdminKursWorkspaceUnit,
  task?: AdminKursWorkspaceTask,
  document?: AdminKursWorkspaceDocument,
  lesson?: LessonEditorPage
) {
  switch (selection.kind) {
    case 'kurs':
      return {
        eyebrow: 'Kurseinstellungen',
        title: 'Kurs bearbeiten',
        description: 'Titel, Beschreibung, Kursart und Sichtbarkeit verwalten.',
      }
    case 'new-unit':
      return {
        eyebrow: kurs.title,
        title: 'Neue Unit',
        description: 'Eine weitere Einheit in diesem Kurs anlegen.',
      }
    case 'unit':
      return {
        eyebrow: 'Unit bearbeiten',
        title: unit?.title ?? 'Unit nicht gefunden',
        description: 'Titel, Beschreibung und Reihenfolge dieser Unit ändern.',
      }
    case 'new-task':
      return {
        eyebrow: 'Neue Aufgabe',
        title: 'Aufgabe anlegen',
        description: 'Eine Aufgabe innerhalb der gewählten Unit anlegen.',
      }
    case 'task':
      return {
        eyebrow: 'Aufgabe bearbeiten',
        title: task?.title ?? 'Aufgabe nicht gefunden',
        description: 'Titel, Beschreibung und Reihenfolge dieser Aufgabe ändern.',
      }
    case 'new-document':
      return {
        eyebrow: 'Neuer Inhalt',
        title: 'Dokument hinzufügen',
        description: 'PDF, Bild oder Bildsammlung zu dieser Aufgabe hinzufügen.',
      }
    case 'document':
      return {
        eyebrow: 'Dokument bearbeiten',
        title: document?.title ?? 'Dokument nicht gefunden',
        description: 'Metadaten, Reihenfolge oder Datei dieses Dokuments ändern.',
      }
    case 'new-lesson':
      return {
        eyebrow: 'Neue Lernseite',
        title: 'Lernseite anlegen',
        description: 'Danach öffnet sich der Seiteninhalt direkt hier im Kurs-Editor.',
      }
    case 'lesson':
      return {
        eyebrow: 'Lernseite bearbeiten',
        title: lesson?.title ?? 'Lernseite nicht gefunden',
        description: 'Inhalt bearbeiten und direkt in diesem Kurs speichern.',
      }
  }
}

function selectedUnitId(kurs: AdminKursWorkspace, selection: Selection): string | null {
  if (selection.kind === 'unit') return selection.id
  if (selection.kind === 'new-task' || selection.kind === 'new-lesson') return selection.unitId
  if (selection.kind === 'task') {
    return kurs.units.find((unit) => unit.tasks.some((task) => task.id === selection.id))?.id ?? null
  }
  if (selection.kind === 'new-document') {
    return kurs.units.find((unit) => unit.tasks.some((task) => task.id === selection.taskId))?.id ?? null
  }
  if (selection.kind === 'document' || selection.kind === 'lesson') {
    return (
      kurs.units.find((unit) =>
        unit.tasks.some((task) => task.documents.some((doc) => doc.id === selection.id))
      )?.id ?? null
    )
  }
  return null
}

function taskCount(kurs: AdminKursWorkspace, unitId: string) {
  return (
    kurs.units
      .find((unit) => unit.id === unitId)
      ?.tasks.filter((task) => task.title !== LESSON_TASK_TITLE).length ?? 0
  )
}

function documentCount(kurs: AdminKursWorkspace, taskId: string) {
  return (
    kurs.units.flatMap((unit) => unit.tasks).find((task) => task.id === taskId)?.documents.length ?? 0
  )
}

function buildLessonPreview(
  kurs: AdminKursWorkspace,
  lessonId: string
): LessonEditorPreview | undefined {
  const unitIndex = kurs.units.findIndex((unit) =>
    unit.tasks.some((task) => task.documents.some((document) => document.id === lessonId))
  )
  if (unitIndex < 0) return undefined

  const unit = kurs.units[unitIndex]
  const lessons = unit.tasks
    .filter((task) => task.title === LESSON_TASK_TITLE)
    .flatMap((task) => task.documents.filter((document) => document.file_type === 'lesson'))
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId)
  if (lessonIndex < 0) return undefined

  return {
    kursId: kurs.id,
    kursTitle: kurs.title,
    units: kurs.units.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      locked: false,
      tasks: item.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        documents: task.documents.map((document) => ({
          id: document.id,
          title: document.title,
          file_type: document.file_type,
        })),
      })),
    })),
    unitId: unit.id,
    unitTitle: unit.title,
    unitDescription: unit.description,
    unitNumber: unitIndex + 1,
    lessonIndex,
    lessonCount: lessons.length,
  }
}

function sidebarRow(active: boolean, extra: string) {
  return `flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${extra} ${
    active
      ? 'bg-brand/10 text-brand'
      : 'text-gray-700 hover:bg-black/[0.04] hover:text-black'
  }`
}

function Dot({ active, muted = false }: { active: boolean; muted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-2 w-2 shrink-0 rounded-full ${
        active ? 'bg-brand' : muted ? 'bg-gray-300' : 'border-2 border-gray-400 bg-transparent'
      }`}
    />
  )
}

function MissingSelection() {
  return (
    <p className="rounded-lg border border-dashed border-gray-300 px-4 py-12 text-center text-sm text-gray-400">
      Dieses Element wurde nicht gefunden. Wähle links einen anderen Eintrag.
    </p>
  )
}
