import { Card, CardPlay, GameState, Player, PlayDecision } from '../types/card'
import { CardRecognizer } from './cardRecognizer'

export class AIPlayer {
  playerId: string
  private memory: AIMemory = new AIMemory()
  
  constructor(playerId: string) {
    this.playerId = playerId
  }
  
  makeDecision(gameState: GameState): PlayDecision {
    const currentPlayer = gameState.players.find(p => p.id === this.playerId)
    if (!currentPlayer) {
      return { action: 'pass' }
    }
    
    // 生成所有合法出牌
    const validPlays = CardRecognizer.getAllValidPlays(
      currentPlayer.hand, 
      gameState.currentPlay
    )
    
    // 如果没有合法出牌，选择不要
    if (validPlays.length === 0) {
      return { action: 'pass' }
    }
    
    // 评估每个出牌选项的价值
    const evaluatedPlays = validPlays.map(cards => ({
      cards,
      score: this.evaluatePlay(cards, gameState)
    }))
    
    // 如果有吹风权，优先出大牌或抢分
    if (gameState.windPlayerId === this.playerId) {
      const scorePlays = evaluatedPlays.filter(p => p.score > 0)
      if (scorePlays.length > 0) {
        const bestScorePlay = scorePlays.sort((a, b) => b.score - a.score)[0]
        return { action: 'play', cards: bestScorePlay.cards }
      }
    }
    
    // 正常决策
    // 1. 计算出牌的价值
    // 2. 计算过牌的价值
    const playScore = Math.max(...evaluatedPlays.map(p => p.score))
    const passScore = this.evaluatePass(gameState)
    
    // 80%概率选择最优策略，20%随机增加趣味性
    if (Math.random() < 0.8) {
      if (playScore > passScore) {
        const bestPlays = evaluatedPlays
          .filter(p => p.score === playScore)
          .sort((a, b) => a.cards.length - b.cards.length)  // 优先出牌数少的
        
        const selectedPlay = bestPlays[0]
        this.memory.update(currentPlayer, selectedPlay.cards)
        return { action: 'play', cards: selectedPlay.cards }
      } else {
        return { action: 'pass' }
      }
    } else {
      // 随机选择
      const randomIndex = Math.floor(Math.random() * (evaluatedPlays.length + 1))
      if (randomIndex === evaluatedPlays.length) {
        return { action: 'pass' }
      } else {
        const selectedPlay = evaluatedPlays[randomIndex]
        this.memory.update(currentPlayer, selectedPlay.cards)
        return { action: 'play', cards: selectedPlay.cards }
      }
    }
  }
  
  private evaluatePlay(cards: Card[], gameState: GameState): number {
    let score = 0
    
    try {
      const play = CardRecognizer.identify(cards)
      
      // 因子1：抢分价值（最重要）
      score += play.scoreValue * 3
      
      // 因子2：牌力价值
      score += play.value * 0.1
      
      // 因子3：手牌减少价值（出牌越多越有利）
      score += cards.length * 2
      
      // 因子4：特殊牌型价值
      if (play.type === '炸弹' || play.type === '至尊') {
        score += 20  // 保留大牌的价值
      }
      if (play.type === '真五十K') {
        score += 10
      }
      
    } catch {
      return -100  // 非法牌型
    }
    
    const currentPlayer = gameState.players.find(p => p.id === this.playerId)
    if (!currentPlayer) return score
    
    // 因子5：团队协作（对家快出完时主动让牌）
    const partner = this.getPartner(gameState)
    if (partner && partner.hand.length < 5 && currentPlayer.hand.length > 10) {
      // 如果对家手牌少，出小牌让对家
      const avgValue = cards.reduce((sum, c) => sum + c.value, 0) / cards.length
      score -= avgValue * 0.3
    }
    
    // 因子6：保留大牌价值（避免出完大牌后无力还击）
    const remainingCards = currentPlayer.hand.filter(c => !cards.includes(c))
    const remainingPower = remainingCards.reduce((sum, c) => sum + c.value, 0)
    const avgRemainingPower = remainingCards.length > 0 
      ? remainingPower / remainingCards.length 
      : 0
    
    // 如果出牌后剩余平均牌力太低，降低出牌价值
    if (avgRemainingPower < 8 && currentPlayer.hand.length > 5) {
      score -= 10
    }
    
    // 因子7：吹风权价值（如果当前有吹风权，优先出牌）
    if (gameState.windPlayerId === this.playerId) {
      score += 15
    }
    
    return score
  }
  
  private evaluatePass(gameState: GameState): number {
    let score = 0
    
    const currentPlayer = gameState.players.find(p => p.id === this.playerId)
    if (!currentPlayer) return score
    
    const partner = this.getPartner(gameState)
    
    // 因子1：对家快出完时，优先过牌让对家
    if (partner && partner.hand.length < 5) {
      score += 30
    }
    
    // 因子2：自己手牌少时，不要冒险出大牌
    if (currentPlayer.hand.length <= 5) {
      score += 20
    }
    
    // 因子3：团队分数领先时，保守策略
    const myTeamId = currentPlayer.teamId
    const myTeamScore = myTeamId === 0 
      ? gameState.teamScores.team0 
      : gameState.teamScores.team1
    const opponentScore = myTeamId === 0 
      ? gameState.teamScores.team1 
      : gameState.teamScores.team0
    
    if (myTeamScore > opponentScore + 30) {
      score += 10
    }
    
    // 因子4：当前牌型没有分值时，优先过牌
    if (gameState.currentPlay && gameState.currentPlay.scoreValue === 0) {
      score += 5
    }
    
    return score
  }
  
  private getPartner(gameState: GameState): Player | undefined {
    const currentPlayer = gameState.players.find(p => p.id === this.playerId)
    if (!currentPlayer) return undefined
    
    const partnerIndex = (currentPlayer.position + 2) % 4
    return gameState.players[partnerIndex]
  }
}

class AIMemory {
  playedCards: Map<string, Card[]> = new Map()
  opponentCardCounts: Map<string, number> = new Map()
  
  update(player: Player, cards: Card[]): void {
    // 记录出牌
    this.playedCards.set(`${player.id}-${Date.now()}`, [...cards])
    
    // 更新对手手牌数量
    cards.forEach(card => {
      this.playedCards.forEach((playedCards, key) => {
        // 记录已出的牌
      })
    })
  }
  
  getOpponentPossibleCards(opponentId: string): Set<number> {
    return new Set()
  }
}
