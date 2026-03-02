import { useState } from 'react'
import { Card as CardType } from '../types/card'
import Card from './Card'
import { CardRecognizer } from '../services/cardRecognizer'

interface CardHandProps {
  cards: CardType[]
  currentPlay: any
  onPlayCards: (cards: CardType[]) => void
  onPass: () => void
  disabled?: boolean
}

export default function CardHand({ cards, currentPlay, onPlayCards, onPass, disabled }: CardHandProps) {
  const [selectedCards, setSelectedCards] = useState<CardType[]>([])
  
  const toggleCard = (card: CardType) => {
    const isSelected = selectedCards.some(
      c => c.suit === card.suit && c.value === card.value
    )
    
    if (isSelected) {
      setSelectedCards(selectedCards.filter(
        c => !(c.suit === card.suit && c.value === card.value)
      ))
    } else {
      setSelectedCards([...selectedCards, card])
    }
  }
  
  const isValidPlay = selectedCards.length > 0 && (() => {
    try {
      const play = CardRecognizer.identify(selectedCards)
      if (!currentPlay) return true
      return CardRecognizer.canBeat(play, currentPlay)
    } catch {
      return false
    }
  })()
  
  const handlePlay = () => {
    if (isValidPlay) {
      onPlayCards(selectedCards)
      setSelectedCards([])
    }
  }
  
  const handlePass = () => {
    onPass()
    setSelectedCards([])
  }
  
  const handleClear = () => {
    setSelectedCards([])
  }
  
  // 按值分组
  const groupedCards = cards.reduce((groups, card) => {
    const key = `${card.suit}-${card.value}`
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(card)
    return groups
  }, {} as Record<string, CardType[]>)
  
  const sortedGroups = Object.values(groupedCards).sort((a, b) => {
    if (b[0].value !== a[0].value) {
      return b[0].value - a[0].value
    }
    const suitOrder = { '♠': 4, '♥': 3, '♣': 2, '♦': 1 }
    return suitOrder[b[0].suit] - suitOrder[a[0].suit]
  })
  
  return (
    <div className="space-y-4">
      {/* 选中的牌 */}
      {selectedCards.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-2">已选择 {selectedCards.length} 张牌</div>
          <div className="flex flex-wrap gap-1 justify-center">
            {selectedCards.map((card, index) => (
              <div
                key={index}
                className="relative"
                onClick={() => toggleCard(card)}
              >
                <Card card={card} selected size="small" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCard(card)
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {/* 显示牌型信息 */}
          {selectedCards.length > 0 && (() => {
            try {
              const play = CardRecognizer.identify(selectedCards)
              return (
                <div className="mt-2 text-center">
                  <span className="text-green-400 text-sm font-semibold">
                    {play.type}
                  </span>
                  {play.scoreValue > 0 && (
                    <span className="ml-2 text-yellow-400 text-sm">
                      +{play.scoreValue}分
                    </span>
                  )}
                  {!isValidPlay && currentPlay && (
                    <span className="ml-2 text-red-400 text-sm">
                      (无法压过上家)
                    </span>
                  )}
                </div>
              )
            } catch {
              return (
                <div className="mt-2 text-center text-red-400 text-sm">
                  非法牌型
                </div>
              )
            }
          })()}
          
          {/* 操作按钮 */}
          <div className="flex gap-2 mt-3 justify-center">
            <button
              onClick={handlePlay}
              disabled={!isValidPlay || disabled}
              className={`
                px-6 py-2 rounded-lg font-bold transition-all
                ${isValidPlay && !disabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              出牌
            </button>
            
            <button
              onClick={handlePass}
              disabled={disabled}
              className={`
                px-6 py-2 rounded-lg font-bold transition-all
                ${!disabled
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              过牌
            </button>
            
            <button
              onClick={handleClear}
              disabled={disabled}
              className="px-4 py-2 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-white transition-all"
            >
              清空
            </button>
          </div>
        </div>
      )}
      
      {/* 手牌 */}
      <div className="flex flex-wrap gap-1 justify-center">
        {sortedGroups.flat().map((card, index) => {
          const isSelected = selectedCards.some(
            c => c.suit === card.suit && c.value === card.value
          )
          return (
            <div
              key={index}
              onClick={() => !disabled && toggleCard(card)}
              className={disabled ? 'opacity-50 pointer-events-none' : ''}
            >
              <Card card={card} selected={isSelected} size="normal" />
            </div>
          )
        })}
      </div>
      
      {/* 提示信息 */}
      {selectedCards.length === 0 && (
        <div className="text-center text-gray-500 text-sm">
          点击牌进行选择
        </div>
      )}
    </div>
  )
}
