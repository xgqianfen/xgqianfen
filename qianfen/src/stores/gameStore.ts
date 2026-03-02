import { create } from 'zustand'
import { Card, GameState } from '../types/card'
import { GameController } from '../services/gameController'

interface GameStore extends GameState {
  controller: GameController
  startGame: () => void
  playerPlay: (cards: Card[]) => boolean
  playerPass: () => boolean
  executeAITurn: () => void
  resetGame: () => void
  updateState: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],
  currentPlayerIndex: 0,
  currentPlay: null,
  gamePhase: 'ready',
  deck: [],
  teamScores: { team0: 0, team1: 0 },
  finishOrder: [],
  windPlayerId: null,
  passCount: 0,
  controller: new GameController(),
  
  startGame: () => {
    const { controller } = get()
    set({
      ...controller.getState()
    })
  },
  
  playerPlay: (cards: Card[]) => {
    const { controller } = get()
    const success = controller.playerPlay('human', cards)
    if (success) {
      set({
        ...controller.getState()
      })
    }
    return success
  },
  
  playerPass: () => {
    const { controller } = get()
    const success = controller.playerPass('human')
    if (success) {
      set({
        ...controller.getState()
      })
    }
    return success
  },
  
  executeAITurn: () => {
    const { controller } = get()
    controller.executeAITurn()
    set({
      ...controller.getState()
    })
  },
  
  resetGame: () => {
    const { controller } = get()
    controller.resetGame()
    set({
      ...controller.getState()
    })
  },
  
  updateState: () => {
    const { controller } = get()
    set({
      ...controller.getState()
    })
  }
}))
