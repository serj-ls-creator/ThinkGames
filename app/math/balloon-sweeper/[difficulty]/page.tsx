import { notFound } from 'next/navigation'
import { BalloonSweeperGame } from '../../../../src/components/games/BalloonSweeper/BalloonSweeperGame'
import { BALLOON_DIFFICULTIES, getDifficultyByKey } from '../../../../src/lib/balloonSweeper'

interface BalloonSweeperPlayPageProps {
  params: {
    difficulty: string
  }
}

export default function BalloonSweeperPlayPage({ params }: BalloonSweeperPlayPageProps) {
  if (!BALLOON_DIFFICULTIES.some((item) => item.key === params.difficulty)) {
    notFound()
  }

  return <BalloonSweeperGame difficulty={getDifficultyByKey(params.difficulty)} />
}
