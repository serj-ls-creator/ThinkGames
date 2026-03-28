'use client'

import { motion } from 'framer-motion'
import { Level, GridSizeOption, LevelSelectorProps } from '../../types'

// Добавим новые опциональные пропсы для прямой синхронизации со стором
interface LevelSelectorWithParentProps extends LevelSelectorProps {
  selectedLevelFromParent?: number;
  selectedGridSizeFromParent?: { rows: number; cols: number };
}

const colorThemes = {
  purple: {
    selected: 'border-purple-500 bg-purple-100 text-purple-700 shadow-sm',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50'
  },
  orange: {
    selected: 'border-orange-500 bg-orange-100 text-orange-700 shadow-sm',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50'
  },
  green: {
    selected: 'border-green-500 bg-green-100 text-green-700 shadow-sm',
    default: 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50'
  }
}

export const LevelSelector: React.FC<LevelSelectorWithParentProps> = ({ 
  levels = [], 
  gridSizes = [],
  colorTheme = 'purple',
  // Значения, которые мы передаем из page.tsx
  selectedLevelFromParent,
  selectedGridSizeFromParent,
  onLevelSelect,
  onGridSizeSelect
}) => {
  // Теперь мы используем значения от родителя, если они есть. Это исправит стиль!
  const selectedLevel = selectedLevelFromParent ?? levels[0]?.value ?? 20;
  const selectedGridSize = selectedGridSizeFromParent ?? gridSizes[0] ?? { rows: 3, cols: 4 };
  const theme = colorThemes[colorTheme]

  return (
    <div className="w-full space-y-8 flex flex-col items-center">
      {/* Секция уровней */}
      <div className="w-full space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 text-center">Оберіть рівень</h2>
        <div className={`
          mx-auto w-full grid gap-3 max-w-2xl justify-center
          ${levels.length === 3 
            ? 'grid-cols-3' 
            : 'grid-cols-2 sm:grid-cols-4'
          }
        `}>
          {levels.map((lvl) => (
            <motion.button
              key={lvl.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onLevelSelect?.(lvl.value);
              }}
              className={`
                w-full min-h-[85px] flex flex-col items-center justify-center 
                py-4 px-2 rounded-2xl border-2 transition-all duration-200
                text-center
                ${selectedLevel === lvl.value ? theme.selected : theme.default}
              `}
            >
              <span className="text-[13px] xs:text-sm sm:text-lg font-black leading-tight text-center w-full">
                {lvl.label}
              </span>
              <span className="text-[9px] sm:text-[11px] opacity-60 leading-tight whitespace-normal mt-1 text-center w-full">
                {lvl.description}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Секция размеров поля */}
      <div className="w-full space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 text-center">Розмір поля</h2>
        <div className={`
          mx-auto w-full grid gap-3 max-w-2xl justify-center
          ${gridSizes.length === 3 
            ? 'grid-cols-3' 
            : 'grid-cols-2 sm:grid-cols-4'
          }
        `}>
          {gridSizes.map((size) => (
            <motion.button
              key={`${size.rows}x${size.cols}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onGridSizeSelect?.(size);
              }}
              className={`
                w-full min-h-[85px] flex flex-col items-center justify-center 
                py-4 px-2 rounded-2xl border-2 transition-all duration-200
                text-center
                ${selectedGridSize.rows === size.rows && selectedGridSize.cols === size.cols 
                  ? theme.selected : theme.default}
              `}
            >
              <span className="text-[13px] xs:text-sm sm:text-lg font-black leading-tight text-center w-full">
                {size.label}
              </span>
              <span className="text-[9px] sm:text-[11px] opacity-60 leading-tight whitespace-normal mt-1 text-center w-full">
                {size.description}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}