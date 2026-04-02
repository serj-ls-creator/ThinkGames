import { supabase } from './supabase'

const GOAL_DAYS = 5

export type DailyChallengeState = {
  user_id: string
  stars: number
  days_in_cycle: number
  last_completed_date: string | null
  created_at?: string
  updated_at?: string
}

type DailyChallengeViewState = {
  stars: number
  daysInCycle: number
}

const normalizeViewState = (
  value?: Partial<DailyChallengeState> | null
): DailyChallengeViewState => ({
  stars: Number(value?.stars || 0),
  daysInCycle: Math.min(GOAL_DAYS, Math.max(0, Number(value?.days_in_cycle || 0)))
})

const parseDateUtc = (date: string) => new Date(`${date}T00:00:00Z`)

const getDayDiff = (previousDate: string, nextDate: string) => {
  const previous = parseDateUtc(previousDate).getTime()
  const next = parseDateUtc(nextDate).getTime()

  return Math.round((next - previous) / (1000 * 60 * 60 * 24))
}

export const getTodayDateString = () => new Date().toISOString().slice(0, 10)

export const getDailyChallengeState = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('daily_challenge_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching daily challenge state:', error)
      return { success: false, error }
    }

    return {
      success: true,
      data: normalizeViewState(data)
    }
  } catch (error) {
    console.error('Error in getDailyChallengeState:', error)
    return { success: false, error }
  }
}

export const recordDailyChallengeCompletion = async (
  userId: string,
  completedAt: string = getTodayDateString()
) => {
  try {
    const { data: currentState, error: fetchError } = await supabase
      .from('daily_challenge_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchError) {
      console.error('Error fetching current daily challenge state:', fetchError)
      return { success: false, error: fetchError }
    }

    if (currentState?.last_completed_date === completedAt) {
      return {
        success: true,
        data: normalizeViewState(currentState)
      }
    }

    let nextDaysInCycle = 1

    if (currentState?.last_completed_date) {
      const dayDiff = getDayDiff(currentState.last_completed_date, completedAt)

      if (dayDiff === 1) {
        nextDaysInCycle =
          currentState.days_in_cycle >= GOAL_DAYS ? 1 : currentState.days_in_cycle + 1
      } else if (dayDiff <= 0) {
        return {
          success: true,
          data: normalizeViewState(currentState)
        }
      }
    }

    const nextStars = Number(currentState?.stars || 0) + (nextDaysInCycle === GOAL_DAYS ? 1 : 0)

    const payload = {
      user_id: userId,
      stars: nextStars,
      days_in_cycle: nextDaysInCycle,
      last_completed_date: completedAt,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('daily_challenge_progress')
      .upsert(payload, { onConflict: 'user_id' })
      .select('*')
      .single()

    if (error) {
      console.error('Error saving daily challenge state:', error)
      return { success: false, error }
    }

    return {
      success: true,
      data: normalizeViewState(data)
    }
  } catch (error) {
    console.error('Error in recordDailyChallengeCompletion:', error)
    return { success: false, error }
  }
}

export const DAILY_CHALLENGE_GOAL_DAYS = GOAL_DAYS
