import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}
