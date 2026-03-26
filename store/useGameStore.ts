import { create } from 'zustand'

export interface Card {
  id: string
  content: string
  pairId: string
  isFlipped: boolean
  isMatched: boolean
}

export interface GameState {
  cards: Card[]
  selectedCards: string[]
  matchedPairs: number
  moves: number
  level: number
  isChecking: boolean
  gameStarted: boolean
  gameCompleted: boolean
}

export interface GameActions {
  initializeGame: (level: number) => void
  flipCard: (cardId: string) => void
  checkMatch: () => void
  resetGame: () => void
  setLevel: (level: number) => void
  setGameCompleted: (completed: boolean) => void
}

export type GameStore = GameState & GameActions

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  cards: [],
  selectedCards: [],
  matchedPairs: 0,
  moves: 0,
  level: 20,
  isChecking: false,
  gameStarted: false,
  gameCompleted: false,

  // Actions
  initializeGame: (level: number) => {
    const { generatePairs } = require('../lib/generatePairs')
    const pairs = generatePairs(level)
    
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

    const gameCompleted = newMatchedPairs === 6 // 6 pairs in 3x4 grid

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

  setGameCompleted: (completed: boolean) => {
    set({ gameCompleted: completed })
  },
}))
