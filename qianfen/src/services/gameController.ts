import { Card, CardPlay, GameState, Player, Suit } from '../types/card'
import { CardRecognizer } from './cardRecognizer'
import { AIPlayer } from './aiPlayer'

export class GameController {
  private state: GameState
  private aiPlayers: Map<string, AIPlayer> = new Map()
  
  constructor() {
    this.state = this.initializeGame()
    this.initAIPlayers()
  }
  
  private initializeGame(): GameState {
    // 创建4个玩家（1个人类+3个AI）
    const players: Player[] = [
      { id: 'human', name: '你', teamId: 1, hand: [], score: 0, position: 0, isAI: false },
      { id: 'ai1', name: 'AI左', teamId: 0, hand: [], score: 0, position: 1, isAI: true },
      { id: 'ai2', name: 'AI上', teamId: 1, hand: [], score: 0, position: 2, isAI: true },
      { id: 'ai3', name: 'AI右', teamId: 0, hand: [], score: 0, position: 3, isAI: true }
    ]
    
    // 生成108张牌
    const deck = this.createDeck()
    
    // 洗牌
    this.shuffle(deck)
    
    // 翻一张牌确定首出权
    const firstCardIndex = Math.floor(Math.random() * deck.length)
    const firstCard = deck[firstCardIndex]
    const firstPlayerIndex = firstPlayerIndex % 4
    
    // 发牌（每人27张，首出者26张）
    let cardIndex = 0
    players.forEach((player, index) => {
      const cardCount = index === firstPlayerIndex ? 26 : 27
      player.hand = deck.slice(cardIndex, cardIndex + cardCount)
      cardIndex += cardCount
      
      // 将翻开的牌给首出者
      if (index === firstPlayerIndex) {
        player.hand.push(firstCard)
      }
      
      // 排序手牌
      player.hand.sort((a, b) => b.value - a.value)
    })
    
    return {
      players,
      currentPlayerIndex: firstPlayerIndex,
      currentPlay: null,
      gamePhase: 'playing',
      deck: [],
      teamScores: { team0: 0, team1: 0 },
      finishOrder: [],
      windPlayerId: null,
      passCount: 0
    }
  }
  
  private initAIPlayers(): void {
    this.state.players.filter(p => p.isAI).forEach(player => {
      this.aiPlayers.set(player.id, new AIPlayer(player.id))
    })
  }
  
  private createDeck(): Card[] {
    const deck: Card[] = []
    const suits = [Suit.SPADE, Suit.HEART, Suit.CLUB, Suit.DIAMOND]
    
    // 两副牌
    for (let deckNum = 0; deckNum < 2; deckNum++) {
      // 3-14（3-A）
      for (let value = 3; value <= 14; value++) {
        suits.forEach(suit => {
          deck.push(new Card(suit, value))
        })
      }
      
      // 2（值15）
      suits.forEach(suit => {
        deck.push(new Card(suit, 15))
      })
      
      // 大小王
      deck.push(new Card(Suit.SPADE, 16))  // 小王
      deck.push(new Card(Suit.SPADE, 17))  // 大王
    }
    
    return deck
  }
  
  private shuffle(deck: Card[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
  }
  
  playerPlay(playerId: string, cards: Card[]): boolean {
    if (this.state.gamePhase !== 'playing') return false
    
    const playerIndex = this.state.players.findIndex(p => p.id === playerId)
    const player = this.state.players[playerIndex]
    
    if (playerIndex !== this.state.currentPlayerIndex) {
      return false  // 不是当前玩家
    }
    
    // 验证出牌合法性
    if (!this.isValidPlay(cards, player.hand, this.state.currentPlay)) {
      return false
    }
    
    // 从手牌中移除
    player.hand = player.hand.filter(c => 
      !cards.some(pc => c.suit === pc.suit && c.value === pc.value)
    )
    
    // 识别牌型并计算得分
    const recognition = CardRecognizer.identify(cards)
    const scoreValue = cards.reduce((sum, c) => sum + c.scoreValue, 0)
    player.score += scoreValue
    
    // 更新当前出牌
    this.state.currentPlay = {
      playerId,
      cards,
      type: recognition.type,
      value: recognition.value,
      scoreValue
    }
    
    // 重置连续不要次数
    this.state.passCount = 0
    
    // 检查是否出完牌
    if (player.hand.length === 0) {
      this.handlePlayerFinish(player)
    }
    
    // 更新团队分数
    this.updateTeamScores()
    
    // 切换到下一个玩家
    this.nextPlayer()
    
    return true
  }
  
  playerPass(playerId: string): boolean {
    if (this.state.gamePhase !== 'playing') return false
    
    const playerIndex = this.state.players.findIndex(p => p.id === playerId)
    if (playerIndex !== this.state.currentPlayerIndex) {
      return false  // 不是当前玩家
    }
    
    this.state.passCount++
    
    // 如果连续3人都不要（即连续3次过牌），获得出牌权的人可以自由出牌
    if (this.state.passCount >= 3 && this.state.currentPlay) {
      this.state.currentPlay = null
      this.state.passCount = 0
    }
    
    this.nextPlayer()
    
    return true
  }
  
  private isValidPlay(cards: Card[], hand: Card[], currentPlay: CardPlay | null): boolean {
    // 检查手牌中是否有这些牌
    const cardCount = cards.reduce((count, card) => {
      const matches = hand.filter(h => h.suit === card.suit && h.value === card.value)
      return count + matches.length
    }, 0)
    
    if (cardCount !== cards.length) {
      return false  // 手牌中没有足够的牌
    }
    
    // 识别牌型
    try {
      CardRecognizer.identify(cards)
    } catch {
      return false  // 非法牌型
    }
    
    // 如果是自由出牌（首出或轮到自由出牌），任何合法牌型都可以
    if (!currentPlay) {
      return true
    }
    
    // 比较牌型大小
    const newPlay = CardRecognizer.identify(cards)
    return CardRecognizer.canBeat(newPlay, currentPlay)
  }
  
  private handlePlayerFinish(player: Player): void {
    // 记录完成顺序
    this.state.finishOrder.push(player.id)
    const finishOrder = this.state.finishOrder.length
    
    player.finishedOrder = finishOrder
    
    // 吹风机制（对家奖励版）
    if (finishOrder === 1 || finishOrder === 2) {
      // 上游或二游出完牌
      const partnerIndex = (player.position + 2) % 4
      const partner = this.state.players[partnerIndex]
      
      // 检查是否触发吹风
      const currentPlayerIndex = this.state.currentPlayerIndex
      const nextPlayerIndex = (currentPlayerIndex + 1) % 4
      
      // 如果下一个玩家是对手，且都管不上，则给对家吹风权
      const opponentIndices = [(player.position + 1) % 4, (player.position + 3) % 4]
      if (opponentIndices.includes(nextPlayerIndex)) {
        this.state.windPlayerId = partner.id
        this.state.currentPlay = null  // 对家可以自由出牌
      }
    }
    
    // 检查游戏是否结束
    if (this.state.finishOrder.length === 4) {
      this.endGame()
    }
  }
  
  private endGame(): void {
    this.state.gamePhase = 'finished'
    
    // 计算团队奖励
    const team0Reward = this.calculateTeamReward(0)
    const team1Reward = this.calculateTeamReward(1)
    
    // 应用奖励
    const rewardDiff = team0Reward - team1Reward
    if (rewardDiff > 0) {
      this.state.teamScores.team0 += rewardDiff
      this.state.teamScores.team1 -= rewardDiff
    } else if (rewardDiff < 0) {
      this.state.teamScores.team0 += rewardDiff
      this.state.teamScores.team1 -= rewardDiff
    }
  }
  
  private calculateTeamReward(teamId: number): number {
    const teamPlayerIndices = teamId === 0 ? [1, 3] : [0, 2]
    const teamRanks = teamPlayerIndices.map(index => {
      const playerId = this.state.players[index].id
      const finishIndex = this.state.finishOrder.indexOf(playerId)
      return finishIndex + 1  // 1-4
    }).sort()
    
    // 上游+二游 = +60分
    if (teamRanks[0] === 1 && teamRanks[1] === 2) {
      return 60
    }
    
    // 上游+三游 = +30分
    if (teamRanks[0] === 1 && teamRanks[1] === 3) {
      return 30
    }
    
    return 0
  }
  
  private updateTeamScores(): void {
    const team0Score = this.state.players
      .filter(p => p.teamId === 0)
      .reduce((sum, p) => sum + p.score, 0)
    
    const team1Score = this.state.players
      .filter(p => p.teamId === 1)
      .reduce((sum, p) => sum + p.score, 0)
    
    this.state.teamScores = { team0: team0Score, team1: team1Score }
  }
  
  private nextPlayer(): void {
    this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % 4
  }
  
  executeAITurn(): void {
    const currentPlayer = this.state.players[this.state.currentPlayerIndex]
    
    if (!currentPlayer.isAI) {
      return  // 不是AI玩家
    }
    
    const aiPlayer = this.aiPlayers.get(currentPlayer.id)
    if (!aiPlayer) return
    
    const decision = aiPlayer.makeDecision(this.state)
    
    if (decision.action === 'play' && decision.cards) {
      this.playerPlay(currentPlayer.id, decision.cards)
    } else {
      this.playerPass(currentPlayer.id)
    }
  }
  
  getState(): GameState {
    return { ...this.state }
  }
  
  resetGame(): void {
    this.state = this.initializeGame()
    this.initAIPlayers()
  }
}
