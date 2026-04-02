import { POINTS_PER_LEVEL } from './points'
import { supabase } from './supabase'

export type LeaderboardEntry = {
  user_id: string
  display_name: string
  avatar_url: string
  total_xp: number
  stars: number
}

export type LeaderboardEntryView = LeaderboardEntry & {
  level: number
  xpInLevel: number
  progressPercentage: number
}

const normalizeEntry = (entry: Partial<LeaderboardEntry>): LeaderboardEntryView => {
  const totalXP = Number(entry.total_xp || 0)
  const xpInLevel = totalXP % POINTS_PER_LEVEL

  return {
    user_id: String(entry.user_id || ''),
    display_name: entry.display_name || 'Гравець',
    avatar_url: entry.avatar_url || '👤',
    total_xp: totalXP,
    stars: Number(entry.stars || 0),
    level: Math.floor(totalXP / POINTS_PER_LEVEL) + 1,
    xpInLevel,
    progressPercentage: Math.floor((xpInLevel / POINTS_PER_LEVEL) * 100)
  }
}

export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from('leaderboard_stats')
      .select('*')
      .order('stars', { ascending: false })
      .order('total_xp', { ascending: false })
      .order('display_name', { ascending: true })

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return { success: false, error }
    }

    return {
      success: true,
      data: (data || []).map((entry) => normalizeEntry(entry))
    }
  } catch (error) {
    console.error('Error in getLeaderboard:', error)
    return { success: false, error }
  }
}
