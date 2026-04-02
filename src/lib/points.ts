import { recordDailyChallengeCompletion } from './dailyChallenge'
import { supabase } from './supabase'

export const POINTS_PER_LEVEL = 500

export const updateUserXP = async (
  userId: string,
  category: 'math' | 'ukrainian' | 'dutch',
  amount: number
) => {
  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('game_progress')
      .select('score')
      .eq('user_id', userId)
      .eq('category', category)
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    const currentScore = currentData?.score || 0
    const newScore = currentScore + amount

    if (!currentData) {
      const { data: insertData, error: insertError } = await supabase
        .from('game_progress')
        .insert({
          user_id: userId,
          category,
          score: newScore
        })
        .select()

      if (insertError) throw insertError
      return { success: true, data: insertData }
    }

    const { data: updateData, error: updateError } = await supabase
      .from('game_progress')
      .update({ score: newScore })
      .eq('user_id', userId)
      .eq('category', category)
      .select()

    if (updateError) throw updateError

    return { success: true, data: updateData }
  } catch (error) {
    console.error('CRITICAL ERROR in updateUserXP:', error)
    return { success: false, error }
  }
}

export const getUserStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('game_progress')
      .select('category, score')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user stats from game_progress:', error)
      return { success: false, error }
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: {
          total_xp: 0,
          current_level: 1,
          xp_in_level: 0,
          math_xp: 0,
          ukrainian_xp: 0,
          dutch_xp: 0
        }
      }
    }

    let math_xp = 0
    let ukrainian_xp = 0
    let dutch_xp = 0
    let total_xp = 0

    data.forEach((record) => {
      const score = record.score || 0
      total_xp += score

      switch (record.category) {
        case 'math':
          math_xp += score
          break
        case 'ukrainian':
          ukrainian_xp += score
          break
        case 'dutch':
          dutch_xp += score
          break
      }
    })

    return {
      success: true,
      data: {
        total_xp,
        current_level: 1,
        xp_in_level: 0,
        math_xp,
        ukrainian_xp,
        dutch_xp
      }
    }
  } catch (error) {
    console.error('Error in getUserStats:', error)
    return { success: false, error }
  }
}

export const getLevelProgress = (xp: number) => {
  const currentLevel = Math.floor(xp / POINTS_PER_LEVEL) + 1
  const xpInLevel = xp % POINTS_PER_LEVEL
  const xpToNextLevel = POINTS_PER_LEVEL

  return {
    currentLevel,
    xpInLevel,
    xpToNextLevel,
    progressPercentage: Math.floor((xpInLevel / xpToNextLevel) * 100)
  }
}

export const addXPWithBonus = async (
  userId: string,
  category: 'math' | 'ukrainian' | 'dutch',
  amount: number,
  isCleanGame: boolean = false
) => {
  const totalAmount = isCleanGame ? amount + 10 : amount

  return await updateUserXP(userId, category, totalAmount)
}

export const saveGameResult = async (
  userId: string | null,
  category: 'math' | 'ukrainian' | 'dutch',
  amount: number,
  isCleanGame: boolean = false
) => {
  if (!userId) {
    return { success: true, data: null }
  }

  const totalAmount = amount
  const result = await updateUserXP(userId, category, totalAmount)

  if (!result.success) {
    console.error('SUPABASE ERROR:', result.error)
    if (result.error && typeof result.error === 'object') {
      console.error(
        'Error details:',
        (result.error as any).message,
        (result.error as any).details,
        (result.error as any).hint
      )
    }

    return result
  }

  const dailyChallengeResult = await recordDailyChallengeCompletion(userId)
  if (!dailyChallengeResult.success) {
    console.error('DAILY CHALLENGE ERROR:', dailyChallengeResult.error)
  }

  return result
}
