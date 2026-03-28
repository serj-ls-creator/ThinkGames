import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nsziiudavflrkzoovpcy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0mFVIkeaDbQ6RIH2BgwAmg_aJAizrmL'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
