import { create } from 'zustand'
import { Card, GridSize, GameState, GameActions } from '../types'

export type GameStore = GameState & GameActions

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  cards: [],
  selectedCards: [],
  matchedPairs: 0,
  moves: 0,
  level: 20,
  gridSize: { rows: 3, cols: 4 },
  isChecking: false,
  gameStarted: false,
  gameCompleted: false,

  // Actions
  initializeGame: (level: number, gridSize?: GridSize) => {
    const { generatePairs } = require('../lib/generatePairs')
    const currentState = get()
    const finalGridSize = gridSize || currentState.gridSize
    
    const totalCards = finalGridSize.rows * finalGridSize.cols
    const pairsNeeded = totalCards / 2
    
    const pairs = generatePairs(level, pairsNeeded)
    
    const cards: Card[] = []
    let cardId = 0

    pairs.forEach((pair: { question: string; answer: string }, pairIndex: number) => {
      cards.push({
        id: `card-${cardId++}`,
        content: pair.question,
        pairId: `pair-${pairIndex}`,
        isFlipped: false,
        isMatched: false,
      })
      cards.push({
        id: `card-${cardId++}`,
        content: pair.answer,
        pairId: `pair-${pairIndex}`,
        isFlipped: false,
        isMatched: false,
      })
    })

    // Shuffle cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5)

    set({
      cards: shuffledCards,
      selectedCards: [],
      matchedPairs: 0,
      moves: 0,
      level,
      gridSize: finalGridSize,
      isChecking: false,
      gameStarted: true,
      gameCompleted: false,
    })
  },

  flipCard: (cardId: string) => {
    const state = get()
    
    if (state.isChecking || state.gameCompleted) return
    
    const card = state.cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newCards = state.cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    )

    const newSelectedCards = [...state.selectedCards, cardId]

    set({
      cards: newCards,
      selectedCards: newSelectedCards,
    })

    if (newSelectedCards.length === 2) {
      set({ isChecking: true, moves: state.moves + 1 })
      
      setTimeout(() => {
        get().checkMatch()
      }, 1000)
    }
  },

  checkMatch: () => {
    const state = get()
    const [firstId, secondId] = state.selectedCards
    
    const firstCard = state.cards.find(c => c.id === firstId)
    const secondCard = state.cards.find(c => c.id === secondId)

    if (!firstCard || !secondCard) return

    const isMatch = firstCard.pairId === secondCard.pairId

    let newCards = state.cards
    let newMatchedPairs = state.matchedPairs

    if (isMatch) {
      newCards = state.cards.map(c =>
        c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
      )
      newMatchedPairs = state.matchedPairs + 1
    } else {
      newCards = state.cards.map(c =>
        c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
      )
    }

    const totalPairs = (state.gridSize.rows * state.gridSize.cols) / 2
    const gameCompleted = newMatchedPairs === totalPairs

    set({
      cards: newCards,
      selectedCards: [],
      matchedPairs: newMatchedPairs,
      isChecking: false,
      gameCompleted,
    })
  },

  resetGame: () => {
    set({
      cards: [],
      selectedCards: [],
      matchedPairs: 0,
      moves: 0,
      isChecking: false,
      gameStarted: false,
      gameCompleted: false,
    })
  },

  setLevel: (level: number) => {
    set({ level })
  },

  setGridSize: (gridSize: GridSize) => {
    set({ gridSize })
  },

  setGameCompleted: (completed: boolean) => {
    set({ gameCompleted: completed })
  },
}))
