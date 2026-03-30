import { notFound } from 'next/navigation'
import DutchWordle from '../../../../../src/components/games/DutchWordle/DutchWordle'

interface DutchWordlePageProps {
  params: {
    level: string
  }
}

export default function DutchWordlePage({ params }: DutchWordlePageProps) {
  const level = Number(params.level)

  if (isNaN(level) || level < 4 || level > 7) {
    notFound()
  }

  return <DutchWordle level={level} />
}
