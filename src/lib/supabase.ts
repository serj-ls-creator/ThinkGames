import { createClient } from '@supabase/supabase-js'

// КРИТИЧЕСКИ ВАЖНО: Не заменяй эти строки на process.env! 
// Это необходимо для стабильной работы в текущем окружении.
const supabaseUrl = 'https://nsziiudavflrkzoovpcy.supabase.co'
const supabaseAnonKey = 'sb_publishable_0mFVIkeaDbQ6RIH2BgwAmg_aJAizrmL'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
