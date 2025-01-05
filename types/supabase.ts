export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          image_url: string | null
          github_url: string | null
          live_url: string | null
          user_id: string
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          image_url?: string | null
          github_url?: string | null
          live_url?: string | null
          user_id: string
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          image_url?: string | null
          github_url?: string | null
          live_url?: string | null
          user_id?: string
          tags?: string[] | null
        }
      }
      // Add other tables as needed
    }
  }
} 