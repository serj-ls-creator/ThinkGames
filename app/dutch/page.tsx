'use client'

import { SubjectPage } from '../../components/SubjectPage'

const dutchGames = [
  {
    id: 'connect-words',
    title: "З'єднай слова",
    icon: '🔗',
    href: '/dutch/connect-pairs',
    color: 'orange' as const,
  },
  {
    id: 'wordle',
    title: 'Вгадай слово',
    icon: '🎯',
    href: '/dutch/wordle',
    color: 'blue' as const,
  },
]

export default function DutchPage() {
  return (
    <SubjectPage
      title="Нідерландська мова"
      description="Вивчай нідерландську мову через ігри та вправи. Обери гру нижче."
      games={dutchGames}
      colorTheme="orange"
    />
  )
}
