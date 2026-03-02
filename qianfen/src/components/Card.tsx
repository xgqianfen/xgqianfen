import { Card as CardType } from '../types/card'

interface CardProps {
  card: CardType
  selected?: boolean
  onClick?: () => void
  size?: 'small' | 'normal' | 'large'
}

export default function Card({ card, selected, onClick, size = 'normal' }: CardProps) {
  const sizeClasses = {
    small: 'w-12 h-16 text-sm',
    normal: 'w-16 h-20 text-lg',
    large: 'w-20 h-28 text-xl'
  }
  
  const isRed = card.suit === '♥' || card.suit === '♦'
  const colorClass = isRed ? 'card-red' : 'card-black'
  
  return (
    <div
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        card-deal
        card
        ${selected ? 'selected' : ''}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
        bg-white rounded-lg shadow-md flex flex-col items-center justify-center
        border-2 ${selected ? 'border-blue-500' : 'border-gray-300'}
        hover:shadow-lg
        ${colorClass}
      `}
    >
      <span className="text-2xl font-bold">{card.suit}</span>
      <span className="font-bold">{card.displayName}</span>
    </div>
  )
}
