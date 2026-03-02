export enum CardType {
  SINGLE = '单张',
  PAIR = '对子',
  TRIPLE = '三条',
  CONSECUTIVE_PAIRS = '连对',
  AIRPLANE = '飞机',
  FAKE_FIFTY_K = '假五十K',
  TRUE_FIFTY_K = '真五十K',
  BOMB = '炸弹',
  FOUR_KINGS = '四大天王',
  SUPREME = '至尊'
}

export enum Suit {
  SPADE = '♠',
  HEART = '♥',
  CLUB = '♣',
  DIAMOND = '♦'
}

export class Card {
  suit: Suit
  value: number  // 3-17（17=大王，16=小王，15=2，14=A，13=K...）
  isJoker: boolean
  
  constructor(suit: Suit, value: number) {
    this.suit = suit
    this.value = value
    this.isJoker = value >= 16
  }
  
  get displayName(): string {
    const valueMap: Record<number, string> = {
      17: '大王', 16: '小王', 15: '2', 14: 'A',
      13: 'K', 12: 'Q', 11: 'J', 10: '10'
    }
    if (this.isJoker) return valueMap[this.value]
    return valueMap[this.value] || this.value.toString()
  }
  
  get scoreValue(): number {
    if (this.isJoker || this.value === 15) return 0  // 大王、小王、2没有分
    if (this.value === 5) return 5
    if (this.value === 10 || this.value === 13) return 10  // 10、K
    return 0
  }
  
  equals(other: Card): boolean {
    return this.suit === other.suit && this.value === other.value
  }
}

export interface CardPlay {
  playerId: string
  cards: Card[]
  type: CardType
  value: number
  scoreValue: number
}

export interface Player {
  id: string
  name: string
  teamId: number
  hand: Card[]
  score: number
  position: number  // 0-3
  isAI: boolean
  finishedOrder?: number  // 出完牌顺序 1-4
}

export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  currentPlay: CardPlay | null
  gamePhase: 'ready' | 'playing' | 'finished'
  deck: Card[]
  teamScores: { team0: number, team1: number }
  finishOrder: string[]  // 玩家ID按出完牌顺序
  windPlayerId: string | null  // 吹风权玩家ID
  passCount: number  // 连续不要次数
}

export interface PlayDecision {
  action: 'play' | 'pass'
  cards?: Card[]
}
