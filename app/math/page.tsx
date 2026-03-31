'use client'

import { SubjectPage } from '../../components/SubjectPage'

const mathGames = [
  {
    id: 'pair-game',
    title: 'Знайди пару',
    icon: '🎏',
    href: '/math/pair-game',
    color: 'purple' as const,
  },
  {
    id: 'connect-pairs',
    title: "З'єднай пару",
    icon: '🔗',
    href: '/math/connect-pairs',
    color: 'purple' as const,
  },
  {
    id: 'gravity-slingshot',
    title: 'Орбітальна Арифметика',
    icon: '🚀',
    href: '/math/gravity-slingshot',
    color: 'purple' as const,
  },
  {
    id: 'balloon-sweeper',
    title: 'Кульковий сапер',
    icon: '🎈',
    href: '/math/balloon-sweeper',
    color: 'purple' as const,
  },
  {
    id: 'balance-scale',
    title: 'Ваги рівноваги',
    icon: '⚖️',
    href: '/math/balance-scale',
    color: 'purple' as const,
  },
]

export default function MathPage() {
  return (
    <SubjectPage
      title="Математика"
      description="Вивчай математику через цікаві ігри та вправи. Обери гру нижче."
      games={mathGames}
      colorTheme="purple"
    />
  )
}
