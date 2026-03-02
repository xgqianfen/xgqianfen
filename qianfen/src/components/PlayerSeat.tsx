import { Player as PlayerType } from '../types/card'

interface PlayerSeatProps {
  player: PlayerType
  isCurrent: boolean
  isPartner?: boolean
  showWind?: boolean
}

export default function PlayerSeat({ player, isCurrent, isPartner, showWind }: PlayerSeatProps) {
  const teamColor = player.teamId === 0 ? 'text-blue-400' : 'text-green-400'
  const bgColor = isCurrent ? 'bg-yellow-900/30 border-yellow-500' : 'bg-gray-800'
  const partnerBadge = isPartner ? '👥' : ''
  
  return (
    <div className={`
      p-4 rounded-lg border-2 ${bgColor}
      ${isCurrent ? 'border-yellow-500' : 'border-gray-700'}
      transition-all duration-300
    `}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-bold text-white">{player.name}</span>
          <span className="ml-2 text-gray-400">{partnerBadge}</span>
        </div>
        {showWind && (
          <span className="text-yellow-400 text-xs font-bold">🌬️ 吹风</span>
        )}
      </div>
      
      <div className="space-y-1">
        <div className={`text-sm ${teamColor} font-semibold`}>
          队伍{player.teamId + 1}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>🃏 {player.hand.length}张</span>
          {player.finishedOrder && (
            <span className="text-yellow-400">
              第{player.finishedOrder}名
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-400">
          得分: <span className="text-white font-bold">{player.score}</span>
        </div>
      </div>
      
      {/* AI玩家显示手牌背面 */}
      {player.isAI && (
        <div className="mt-3 flex flex-wrap gap-0.5">
          {Array.from({ length: Math.min(player.hand.length, 10) }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded border border-blue-400"
            />
          ))}
          {player.hand.length > 10 && (
            <span className="text-xs text-gray-400 self-center ml-1">
              +{player.hand.length - 10}
            </span>
          )}
        </div>
      )}
      
      {isCurrent && player.isAI && (
        <div className="mt-2 text-yellow-400 text-xs flex items-center gap-1">
          <span className="animate-pulse">●</span>
          思考中...
        </div>
      )}
    </div>
  )
}
