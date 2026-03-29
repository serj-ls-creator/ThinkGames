import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface GameProgress {
  id: string
  session_id: string
  level: number
  score: number
  created_at: string
}

export const getGameProgress = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('game_progress')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching game progress:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to fetch game progress:', error)
    throw error
  }
}
