import { Card, CardType, Suit } from '../types/card'

export class CardRecognizer {
  static identify(cards: Card[]): {
    type: CardType,
    value: number,
    scoreValue: number
  } {
    const sorted = [...cards].sort((a, b) => a.value - b.value)
    
    // 至尊（8张相同）
    if (cards.length === 8 && cards.every(c => c.value === cards[0].value)) {
      return {
        type: CardType.SUPREME,
        value: cards[0].value,
        scoreValue: 0
      }
    }
    
    // 四大天王（4张王）
    if (cards.length === 4 && this.isFourKings(cards)) {
      return {
        type: CardType.FOUR_KINGS,
        value: 17,
        scoreValue: 0
      }
    }
    
    // 炸弹（4-7张相同）
    if (cards.length >= 4 && cards.length <= 7 && 
        cards.every(c => c.value === cards[0].value)) {
      return {
        type: CardType.BOMB,
        value: cards[0].value,
        scoreValue: 0
      }
    }
    
    // 单张
    if (cards.length === 1) {
      return {
        type: CardType.SINGLE,
        value: cards[0].value,
        scoreValue: cards[0].scoreValue
      }
    }
    
    // 对子
    if (cards.length === 2 && cards[0].value === cards[1].value) {
      return {
        type: CardType.PAIR,
        value: cards[0].value,
        scoreValue: cards[0].scoreValue * 2
      }
    }
    
    // 三条
    if (cards.length === 3 && cards.every(c => c.value === cards[0].value)) {
      return {
        type: CardType.TRIPLE,
        value: cards[0].value,
        scoreValue: cards[0].scoreValue * 3
      }
    }
    
    // 五十K检测
    if (cards.length === 3 && this.isFiftyK(cards)) {
      const isTrueFiftyK = this.isTrueFiftyK(cards)
      return {
        type: isTrueFiftyK ? CardType.TRUE_FIFTY_K : CardType.FAKE_FIFTY_K,
        value: isTrueFiftyK ? this.getTrueFiftyKValue(cards) : 50,
        scoreValue: isTrueFiftyK ? 50 : 20
      }
    }
    
    // 连对
    if (cards.length >= 4 && cards.length % 2 === 0) {
      const valueGroups = this.groupByValue(cards)
      const values = Object.keys(valueGroups).map(Number).sort((a, b) => a - b)
      
      // 每组必须有2张
      if (Object.values(valueGroups).every(g => g.length === 2)) {
        // 检查是否连续且不包含2
        const isConsecutive = values.every((v, i) => 
          i === 0 || v === values[i - 1] + 1
        ) && !values.includes(15)
        
        if (isConsecutive) {
          const scoreValue = cards.reduce((sum, c) => sum + c.scoreValue, 0)
          return {
            type: CardType.CONSECUTIVE_PAIRS,
            value: values[values.length - 1],
            scoreValue
          }
        }
      }
    }
    
    // 飞机
    if (cards.length >= 6 && cards.length % 3 === 0) {
      const valueGroups = this.groupByValue(cards)
      const values = Object.keys(valueGroups).map(Number).sort((a, b) => a - b)
      
      if (Object.values(valueGroups).every(g => g.length === 3)) {
        const isConsecutive = values.every((v, i) => 
          i === 0 || v === values[i - 1] + 1
        ) && !values.includes(15)
        
        if (isConsecutive) {
          const scoreValue = cards.reduce((sum, c) => sum + c.scoreValue, 0)
          return {
            type: CardType.AIRPLANE,
            value: values[values.length - 1],
            scoreValue
          }
        }
      }
    }
    
    throw new Error('非法牌型')
  }
  
  private static isFourKings(cards: Card[]): boolean {
    const jokers = cards.filter(c => c.isJoker)
    if (jokers.length !== 4) return false
    
    const bigJokers = jokers.filter(c => c.value === 17).length
    const smallJokers = jokers.filter(c => c.value === 16).length
    
    return bigJokers === 2 && smallJokers === 2
  }
  
  private static isFiftyK(cards: Card[]): boolean {
    const values = cards.map(c => c.value).sort((a, b) => a - b)
    return values.includes(5) && values.includes(10) && values.includes(13)
  }
  
  private static isTrueFiftyK(cards: Card[]): boolean {
    const suits = new Set(cards.map(c => c.suit))
    return suits.size === 1
  }
  
  private static getTrueFiftyKValue(cards: Card[]): number {
    const suit = cards[0].suit
    const suitOrder: Record<Suit, number> = {
      [Suit.SPADE]: 4,
      [Suit.HEART]: 3,
      [Suit.CLUB]: 2,
      [Suit.DIAMOND]: 1
    }
    return 50 + suitOrder[suit] * 10
  }
  
  private static groupByValue(cards: Card[]): Record<number, Card[]> {
    return cards.reduce((groups, card) => {
      if (!groups[card.value]) {
        groups[card.value] = []
      }
      groups[card.value].push(card)
      return groups
    }, {} as Record<number, Card[]>)
  }
  
  static canBeat(newPlay: any, currentPlay: any): boolean {
    const newType = newPlay.type
    const currentType = currentPlay.type
    
    // 牌型优先级
    const typePriority: Record<CardType, number> = {
      [CardType.SUPREME]: 9,
      [CardType.FOUR_KINGS]: 8,
      [CardType.BOMB]: 7,
      [CardType.TRUE_FIFTY_K]: 6,
      [CardType.FAKE_FIFTY_K]: 5,
      [CardType.AIRPLANE]: 4,
      [CardType.CONSECUTIVE_PAIRS]: 3,
      [CardType.TRIPLE]: 2,
      [CardType.PAIR]: 1,
      [CardType.SINGLE]: 0
    }
    
    // 炸弹按张数调整优先级
    let newPriority = typePriority[newType]
    if (newType === CardType.BOMB) {
      newPriority = 3 + newPlay.cards.length  // 4张=7, 5张=8, 6张=9, 7张=10
    }
    
    let currentPriority = typePriority[currentType]
    if (currentType === CardType.BOMB) {
      currentPriority = 3 + currentPlay.cards.length
    }
    
    // 高优先级牌型可以压低优先级
    if (newPriority > currentPriority) {
      return true
    }
    
    // 相同优先级才能比较
    if (newPriority !== currentPriority) {
      return false
    }
    
    // 相同牌型比较大小
    if (newType === CardType.BOMB) {
      // 同张数的炸弹按点数
      if (newPlay.cards.length === currentPlay.cards.length) {
        return newPlay.value > currentPlay.value
      }
      return false  // 不同张数的炸弹前面已经处理
    }
    
    // 真五十K之间按花色
    if (newType === CardType.TRUE_FIFTY_K && currentType === CardType.TRUE_FIFTY_K) {
      return newPlay.value > currentPlay.value
    }
    
    // 其他相同牌型按值比较
    return newPlay.value > currentPlay.value
  }
  
  static getAllValidPlays(hand: Card[], currentPlay: any | null): Card[][] {
    const plays: Card[][] = []
    
    // 如果是自由出牌，生成所有可能的牌型
    if (!currentPlay) {
      plays.push(...this.generateAllPlays(hand))
    } else {
      // 否则生成能压制的牌型
      plays.push(...this.generateBeatingPlays(hand, currentPlay))
    }
    
    return plays
  }
  
  private static generateAllPlays(hand: Card[]): Card[][] {
    const plays: Card[][] = []
    const handStrs = hand.map(c => `${c.suit}${c.value}`)
    const used = new Set<string>()
    
    // 单张
    hand.forEach(card => {
      const key = `${card.suit}${card.value}`
      if (!used.has(key)) {
        plays.push([card])
        used.add(key)
      }
    })
    
    // 对子
    const pairs = this.findPairs(hand)
    pairs.forEach(pair => {
      const key = pair.map(c => `${c.suit}${c.value}`).sort().join(',')
      if (!used.has(key)) {
        plays.push(pair)
        used.add(key)
      }
    })
    
    // 三条
    const threes = this.findThrees(hand)
    threes.forEach(three => {
      const key = three.map(c => `${c.suit}${c.value}`).sort().join(',')
      if (!used.has(key)) {
        plays.push(three)
        used.add(key)
      }
    })
    
    // 连对
    const consecutivePairs = this.generateConsecutivePairs(hand)
    consecutivePairs.forEach(pair => {
      const key = pair.map(c => `${c.suit}${c.value}`).sort().join(',')
      if (!used.has(key)) {
        plays.push(pair)
        used.add(key)
      }
    })
    
    // 飞机
    const airplanes = this.generateAirplanes(hand)
    airplanes.forEach(plane => {
      const key = plane.map(c => `${c.suit}${c.value}`).sort().join(',')
      if (!used.has(key)) {
        plays.push(plane)
        used.add(key)
      }
    })
    
    // 五十K
    const fiftyK = this.generateFiftyK(hand)
    fiftyK.forEach(fk => {
      const key = fk.map(c => `${c.suit}${c.value}`).sort().join(',')
      if (!used.has(key)) {
        plays.push(fk)
        used.add(key)
      }
    })
    
    // 炸弹
    const bombs = this.findBombs(hand)
    bombs.forEach(bomb => {
      const key = bomb.map(c => `${c.suit}${c.value}`).sort().join(',')
      if (!used.has(key)) {
        plays.push(bomb)
        used.add(key)
      }
    })
    
    // 四大天王
    const fourKings = this.findFourKings(hand)
    if (fourKings) {
      plays.push(fourKings)
    }
    
    // 至尊
    const suprems = this.findSuprems(hand)
    suprems.forEach(sup => {
      const key = sup.map(c => `${c.suit}${c.value}`).sort().join(',')
      if (!used.has(key)) {
        plays.push(sup)
        used.add(key)
      }
    })
    
    return plays
  }
  
  private static generateBeatingPlays(hand: Card[], currentPlay: any): Card[][] {
    const plays: Card[][] = []
    const allPlays = this.generateAllPlays(hand)
    
    allPlays.forEach(playCards => {
      try {
        const newPlay = this.identify(playCards)
        if (this.canBeat(newPlay, currentPlay)) {
          plays.push(playCards)
        }
      } catch {
        // 忽略非法牌型
      }
    })
    
    return plays
  }
  
  private static findPairs(hand: Card[]): Card[][] {
    const valueGroups = this.groupByValue(hand)
    const pairs: Card[][] = []
    
    Object.entries(valueGroups).forEach(([value, cards]) => {
      if (cards.length >= 2) {
        // 生成所有可能的对子组合
        for (let i = 0; i < cards.length - 1; i++) {
          for (let j = i + 1; j < cards.length; j++) {
            pairs.push([cards[i], cards[j]])
          }
        }
      }
    })
    
    return pairs
  }
  
  private static findThrees(hand: Card[]): Card[][] {
    const valueGroups = this.groupByValue(hand)
    const threes: Card[][] = []
    
    Object.entries(valueGroups).forEach(([value, cards]) => {
      if (cards.length >= 3) {
        // 生成所有可能的三条组合
        for (let i = 0; i < cards.length - 2; i++) {
          for (let j = i + 1; j < cards.length - 1; j++) {
            for (let k = j + 1; k < cards.length; k++) {
              threes.push([cards[i], cards[j], cards[k]])
            }
          }
        }
      }
    })
    
    return threes
  }
  
  private static generateConsecutivePairs(hand: Card[]): Card[][] {
    const valueGroups = this.groupByValue(hand)
    const values = Object.keys(valueGroups)
      .map(Number)
      .filter(v => v !== 15)  // 排除2
      .sort((a, b) => a - b)
    
    const pairs = values.filter(v => valueGroups[v].length >= 2)
    const consecutivePairs: Card[][] = []
    
    // 找连续的值
    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        // 检查是否连续
        let isConsecutive = true
        for (let k = i; k < j; k++) {
          if (pairs[k + 1] - pairs[k] !== 1) {
            isConsecutive = false
            break
          }
        }
        
        if (isConsecutive && j - i >= 1) {  // 至少2对
          // 生成所有可能的组合
          const pairOptions = pairs.slice(i, j + 1).map(v => 
            this.findPairs(valueGroups[v])
          )
          
          this.generateCombinations(pairOptions, 0, [], consecutivePairs)
        }
      }
    }
    
    return consecutivePairs
  }
  
  private static generateAirplanes(hand: Card[]): Card[][] {
    const valueGroups = this.groupByValue(hand)
    const values = Object.keys(valueGroups)
      .map(Number)
      .filter(v => v !== 15)
      .sort((a, b) => a - b)
    
    const threes = values.filter(v => valueGroups[v].length >= 3)
    const airplanes: Card[][] = []
    
    // 找连续的值
    for (let i = 0; i < threes.length; i++) {
      for (let j = i + 1; j < threes.length; j++) {
        // 检查是否连续
        let isConsecutive = true
        for (let k = i; k < j; k++) {
          if (threes[k + 1] - threes[k] !== 1) {
            isConsecutive = false
            break
          }
        }
        
        if (isConsecutive && j - i >= 1) {  // 至少2个三条
          const threeOptions = threes.slice(i, j + 1).map(v => 
            this.findThrees(valueGroups[v])
          )
          
          this.generateCombinations(threeOptions, 0, [], airplanes)
        }
      }
    }
    
    return airplanes
  }
  
  private static generateFiftyK(hand: Card[]): Card[][] {
    const fives = hand.filter(c => c.value === 5)
    const tens = hand.filter(c => c.value === 10)
    const ks = hand.filter(c => c.value === 13)
    
    const fiftyK: Card[][] = []
    
    // 生成所有五十K组合
    fives.forEach(five => {
      tens.forEach(ten => {
        ks.forEach(k => {
          fiftyK.push([five, ten, k])
        })
      })
    })
    
    return fiftyK
  }
  
  private static findBombs(hand: Card[]): Card[][] {
    const valueGroups = this.groupByValue(hand)
    const bombs: Card[][] = []
    
    Object.entries(valueGroups).forEach(([value, cards]) => {
      if (cards.length >= 4) {
        // 4-7张炸弹
        for (let len = 4; len <= Math.min(cards.length, 7); len++) {
          this.generateCombinations([cards], 0, [], bombs, len)
        }
      }
    })
    
    return bombs
  }
  
  private static findFourKings(hand: Card[]): Card[] | null {
    const jokers = hand.filter(c => c.isJoker)
    const bigJokers = jokers.filter(c => c.value === 17)
    const smallJokers = jokers.filter(c => c.value === 16)
    
    if (bigJokers.length >= 2 && smallJokers.length >= 2) {
      return [...bigJokers.slice(0, 2), ...smallJokers.slice(0, 2)]
    }
    
    return null
  }
  
  private static findSuprems(hand: Card[]): Card[][] {
    const valueGroups = this.groupByValue(hand)
    const suprems: Card[][] = []
    
    Object.entries(valueGroups).forEach(([value, cards]) => {
      if (cards.length >= 8) {
        // 生成所有8张组合
        this.generateCombinations([cards], 0, [], suprems, 8)
      }
    })
    
    return suprems
  }
  
  private static generateCombinations(
    arrays: Card[][],
    index: number,
    current: Card[],
    results: Card[][],
    targetLength?: number
  ): void {
    if (index >= arrays.length) {
      if (!targetLength || current.length === targetLength) {
        results.push([...current])
      }
      return
    }
    
    const array = arrays[index]
    for (const item of array) {
      current.push(item)
      this.generateCombinations(arrays, index + 1, current, results, targetLength)
      current.pop()
    }
  }
}
