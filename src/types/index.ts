export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface Kurs {
  id: string
  title: string
  description: string | null
  published: boolean
  position: number
  created_at: string
}

export interface Unit {
  id: string
  kurs_id: string
  title: string
  description: string | null
  position: number
  created_at: string
}

export interface Task {
  id: string
  unit_id: string
  title: string
  description: string | null
  position: number
  created_at: string
}

export interface Document {
  id: string
  task_id: string
  title: string
  description: string | null
  file_path: string
  file_type: 'pdf' | 'image'
  position: number
  created_at: string
}

export interface TaskWithDocuments extends Task {
  documents: Document[]
}

export interface UnitWithTasks extends Unit {
  tasks: TaskWithDocuments[]
}

export interface KursWithUnits extends Kurs {
  units: UnitWithTasks[]
}
