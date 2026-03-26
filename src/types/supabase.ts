// Типы для таблиц Supabase

export interface Database {
  public: {
    Tables: {
      game_results: {
        Row: {
          id: string
          session_id: string
          game: string
          section: string
          level: number
          score: number
          time_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          game: string
          section: string
          level: number
          score: number
          time_seconds: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          game?: string
          section?: string
          level?: number
          score?: number
          time_seconds?: number
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          session_id: string
          section: string
          game: string
          level: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          section: string
          game: string
          level: number
          completed: boolean
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          section?: string
          game?: string
          level?: number
          completed?: boolean
          created_at?: string
        }
      }
    }
  }
}
