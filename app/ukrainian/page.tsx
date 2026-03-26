'use client'

import { SubjectPage } from '../../components/SubjectPage'

const ukrainianGames: Array<{
  id: string
  title: string
  icon: string
  href: string
  color: 'purple' | 'orange'
}> = [] // Пока нет игр

export default function UkrainianPage() {
  return (
    <SubjectPage
      title="Українська мова"
      description="Покращуй свою українську мову через цікаві вправи та завдання."
      games={ukrainianGames}
      colorTheme="purple"
    />
  )
}
