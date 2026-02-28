export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface Document {
  id: string
  title: string
  description: string | null
  pdf_path: string
  published: boolean
  created_at: string
}
