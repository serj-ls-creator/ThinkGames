import { DAILY_MESSAGES } from '../data/dailyMessages'
import { getSessionId } from './utils'

const DAILY_MESSAGE_START_DATE = '2026-04-03'
const KYIV_TIMEZONE = 'Europe/Kiev'
const READ_STORAGE_PREFIX = 'thinkgames-daily-message-read'

export type DailyMessage = {
  id: number
  text: string
  date: string
}

const formatDateInKyiv = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: KYIV_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

const parseUtcDate = (date: string) => new Date(`${date}T00:00:00Z`)

const getDayDiff = (startDate: string, endDate: string) => {
  const start = parseUtcDate(startDate).getTime()
  const end = parseUtcDate(endDate).getTime()
  return Math.floor((end - start) / (1000 * 60 * 60 * 24))
}

const getViewerId = (userId?: string | null) => userId || getSessionId() || 'guest'

const getReadKey = (viewerId: string, messageDate: string, messageId: number) =>
  `${READ_STORAGE_PREFIX}:${viewerId}:${messageDate}:${messageId}`

export const getTodayMessageDate = () => formatDateInKyiv(new Date())

export const getDailyMessageForDate = (date: string): DailyMessage => {
  const daysSinceStart = Math.max(0, getDayDiff(DAILY_MESSAGE_START_DATE, date))
  const id = daysSinceStart % DAILY_MESSAGES.length

  return {
    id,
    text: DAILY_MESSAGES[id],
    date,
  }
}

export const getTodayDailyMessage = () => getDailyMessageForDate(getTodayMessageDate())

export const isDailyMessageRead = (message: DailyMessage, userId?: string | null) => {
  if (typeof window === 'undefined') return true

  const viewerId = getViewerId(userId)
  return localStorage.getItem(getReadKey(viewerId, message.date, message.id)) === '1'
}

export const markDailyMessageAsRead = (message: DailyMessage, userId?: string | null) => {
  if (typeof window === 'undefined') return

  const viewerId = getViewerId(userId)
  localStorage.setItem(getReadKey(viewerId, message.date, message.id), '1')
}
