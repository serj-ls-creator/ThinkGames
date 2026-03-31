import { notFound } from 'next/navigation'
import { GRAVITY_LEVELS_DATA } from '../../../../src/data/gravityGameLevels'
import GravityGameClient from './GravityGameClient'

export default function GravitySlingshotPage({ params }: { params: { level: string } }) {
  const level = parseInt(params.level)
  
  // Проверяем, существует ли уровень
  if (isNaN(level) || level < 1 || level > GRAVITY_LEVELS_DATA.length) {
    notFound()
  }

  return <GravityGameClient level={level} />
}

export async function generateStaticParams() {
  return GRAVITY_LEVELS_DATA.map((level) => ({
    level: level.level.toString(),
  }))
}
