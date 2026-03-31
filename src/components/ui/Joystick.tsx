'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface JoystickProps {
  onMove: (vector: { x: number, y: number }) => void
  size?: number
  stickSize?: number
  className?: string
}

export default function Joystick({ 
  onMove, 
  size = 120, 
  stickSize = 40,
  className = ""
}: JoystickProps) {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const baseRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault()
    isDragging.current = true
    setIsActive(true)
    
    // Предотвращаем прокрутку страницы
    document.body.style.touchAction = 'none'
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault()
    
    if (!baseRef.current) {
      return
    }
    
    const rect = baseRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    let clientX, clientY
    
    // Получаем координаты в зависимости от типа события
    if ('touches' in e) {
      // Touch событие
      if (e.touches.length === 0) {
        return
      }
      const touch = e.touches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      // Pointer событие
      clientX = e.clientX
      clientY = e.clientY
    }
    
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = size / 2 - stickSize / 2
    
    let normalizedX = 0
    let normalizedY = 0
    let stickX = 0
    let stickY = 0
    
    if (distance <= maxDistance) {
      stickX = deltaX
      stickY = deltaY
      normalizedX = deltaX / maxDistance
      normalizedY = deltaY / maxDistance
    } else {
      const angle = Math.atan2(deltaY, deltaX)
      stickX = Math.cos(angle) * maxDistance
      stickY = Math.sin(angle) * maxDistance
      normalizedX = Math.cos(angle)
      normalizedY = Math.sin(angle)
    }
    
    setPosition({ x: stickX, y: stickY })
    onMove({ x: normalizedX, y: normalizedY })
  }, [size, stickSize, onMove])

  const handlePointerUp = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    e.preventDefault()
    isDragging.current = false
    setIsActive(false)
    setPosition({ x: 0, y: 0 })
    onMove({ x: 0, y: 0 })
    
    // Восстанавливаем прокрутку страницы
    document.body.style.touchAction = ''
  }, [onMove])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      document.body.style.touchAction = ''
    }
  }, [])

  // Обработка глобальных событий для продолжения управления при выходе за пределы джойстика
  useEffect(() => {
    const handleGlobalMove = (e: any) => {
      if (isDragging.current) {
        handlePointerMove(e)
      }
    }

    const handleGlobalUp = (e: any) => {
      if (isDragging.current) {
        handlePointerUp(e)
      }
    }

    if (isDragging.current) {
      window.addEventListener('touchmove', handleGlobalMove, { passive: false })
      window.addEventListener('touchend', handleGlobalUp)
      window.addEventListener('touchcancel', handleGlobalUp)
      window.addEventListener('pointermove', handleGlobalMove)
      window.addEventListener('pointerup', handleGlobalUp)
      window.addEventListener('pointercancel', handleGlobalUp)
    }

    return () => {
      window.removeEventListener('touchmove', handleGlobalMove)
      window.removeEventListener('touchend', handleGlobalUp)
      window.removeEventListener('touchcancel', handleGlobalUp)
      window.removeEventListener('pointermove', handleGlobalMove)
      window.removeEventListener('pointerup', handleGlobalUp)
      window.removeEventListener('pointercancel', handleGlobalUp)
    }
  }, [isDragging.current, handlePointerMove, handlePointerUp])

  return (
    <div 
      ref={baseRef}
      className={`relative select-none ${className}`}
      style={{ width: size, height: size }}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* База джойстика */}
      <div 
        className={`
          absolute inset-0 rounded-full 
          bg-white/20 backdrop-blur-md border border-white/30
          shadow-lg shadow-purple-500/20
          transition-all duration-200
          ${isActive ? 'scale-105 bg-white/30' : ''}
        `}
      />
      
      {/* Индикатор направления */}
      {isActive && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div 
            className="w-0.5 h-full bg-purple-400/30 absolute"
            style={{
              transform: `rotate(${Math.atan2(position.y, position.x) * 180 / Math.PI + 90}deg)`,
              transformOrigin: 'center'
            }}
          />
        </div>
      )}
      
      {/* Стик джойстика */}
      <motion.div
        ref={stickRef}
        className={`
          absolute rounded-full 
          bg-gradient-to-br from-purple-500 to-purple-600 
          shadow-lg shadow-purple-500/40
          border border-white/50
          cursor-pointer
          transition-shadow duration-200
          ${isActive ? 'shadow-purple-500/60' : ''}
        `}
        style={{
          width: stickSize,
          height: stickSize,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          x: position.x,
          y: position.y,
          scale: isActive ? 1.1 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {/* Блик на стике */}
        <div className="absolute inset-1 rounded-full bg-white/30" />
      </motion.div>
      
      {/* Центральная точка */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/50 pointer-events-none" />
    </div>
  )
}
