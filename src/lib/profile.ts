export const PROFILE_STORAGE_KEY = 'thinkgames-user-profile'

export const AVATAR_OPTIONS = [
  '😀', '😎', '🤓', '🥳', '😺', '🦊', '🐼', '🐯',
  '🐸', '🐵', '🦄', '🐻', '🐨', '🐶', '🐱', '🐹',
  '🌟', '🔥', '⚡', '🌈', '🍀', '🍎', '🎯', '🎮',
  '🚀', '🛸', '🎨', '🧠', '🧩', '🏆', '🎵', '📚',
] as const

export interface UserProfile {
  name: string
  avatar: string
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Друже',
  avatar: '🦊',
}

export function normalizeProfile(input?: Partial<UserProfile> | null): UserProfile {
  return {
    name: input?.name?.trim() || DEFAULT_PROFILE.name,
    avatar: input?.avatar || DEFAULT_PROFILE.avatar,
  }
}
