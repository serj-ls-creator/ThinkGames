import { notFound } from 'next/navigation'
import { GRAVITY_LEVELS } from '../../../../src/lib/gravityGame'
import GravityGameClient from './GravityGameClient'

export default function GravitySlingshotPage({ params }: { params: { level: string } }) {
  const level = parseInt(params.level)
  
  // Проверяем, существует ли уровень
  if (isNaN(level) || level < 1 || level > GRAVITY_LEVELS.length) {
    notFound()
  }

  return <GravityGameClient level={level} />
}

export async function generateStaticParams() {
  return GRAVITY_LEVELS.map((level) => ({
    level: level.level.toString(),
  }))
}
