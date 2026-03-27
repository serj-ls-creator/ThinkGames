import { notFound } from 'next/navigation'
import { BalanceScaleGame } from '../../../../src/components/games/BalanceScale/BalanceScaleGame'
import { BALANCE_LEVELS } from '../../../../src/lib/balanceScale'

interface BalanceScalePlayPageProps {
  params: {
    level: string
  }
}

export default function BalanceScalePlayPage({ params }: BalanceScalePlayPageProps) {
  const level = Number(params.level)

  if (!BALANCE_LEVELS.some((item) => item.value === level)) {
    notFound()
  }

  return <BalanceScaleGame maxValue={level} />
}
