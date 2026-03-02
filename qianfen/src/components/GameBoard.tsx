import { useEffect, useState } from 'react'
import { Card as CardType, GameState } from '../types/card'
import { useGameStore } from '../stores/gameStore'
import PlayerSeat from './PlayerSeat'
import CardHand from './CardHand'
import Card from './Card'
import { CardRecognizer } from '../services/cardRecognizer'

export default function GameBoard() {
  const {
    players,
    currentPlayerIndex,
    currentPlay,
    gamePhase,
    teamScores,
    finishOrder,
    windPlayerId,
    passCount,
    startGame,
    playerPlay,
    playerPass,
    executeAITurn,
    resetGame,
    updateState
  } = useGameStore()
  
  const [aiThinking, setAiThinking] = useState(false)
  
  // 初始化游戏
  useEffect(() => {
    startGame()
  }, [])
  
  // AI自动出牌
  useEffect(() => {
    if (gamePhase !== 'playing') return
    
    const currentPlayer = players[currentPlayerIndex]
    
    if (currentPlayer && currentPlayer.isAI && !aiThinking) {
      setAiThinking(true)
      
      // 模拟思考时间
      const thinkTime = 1000 + Math.random() * 1000
      setTimeout(() => {
        executeAITurn()
        setAiThinking(false)
      }, thinkTime)
    }
  }, [currentPlayerIndex, gamePhase, players])
  
  const handlePlayCards = (cards: CardType[]) => {
    const success = playerPlay(cards)
    if (!success) {
      alert('出牌不合法，请检查牌型或大小')
    }
  }
  
  const handlePass = () => {
    const success = playerPass()
    if (!success) {
      alert('无法过牌，请出牌')
    }
  }
  
  const handleResetGame = () => {
    if (window.confirm('确定要重新开始游戏吗？')) {
      resetGame()
    }
  }
  
  // 游戏结束显示
  if (gamePhase === 'finished') {
    const winnerTeam = teamScores.team0 > teamScores.team1 ? 0 : 1
    const winnerName = winnerTeam === 0 ? '队伍0' : '队伍1'
    
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">
            🎉 游戏结束！
          </h1>
          
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="text-2xl">
              <span className="text-blue-400 font-bold">队伍0:</span>
              <span className="ml-4 text-3xl">{teamScores.team0}分</span>
            </div>
            <div className="text-2xl">
              <span className="text-green-400 font-bold">队伍1:</span>
              <span className="ml-4 text-3xl">{teamScores.team1}分</span>
            </div>
            <div className="border-t border-gray-700 pt-4 mt-4">
              <div className="text-3xl font-bold text-yellow-400">
                {winnerName} 获胜！
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-gray-400">
            <h3 className="text-xl font-bold text-white mb-3">排名</h3>
            {finishOrder.map((playerId, index) => {
              const player = players.find(p => p.id === playerId)
              if (!player) return null
              return (
                <div key={playerId} className="text-lg">
                  第{index + 1}名: {player.name} (队伍{player.teamId + 1})
                </div>
              )
            })}
          </div>
          
          <button
            onClick={handleResetGame}
            className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xl transition-all"
          >
            再来一局
          </button>
        </div>
      </div>
    )
  }
  
  const currentPlayer = players[currentPlayerIndex]
  const humanPlayer = players[0]
  const isMyTurn = currentPlayer && currentPlayer.id === 'human'
  
  // 获取对家信息
  const getPartnerInfo = (playerId: string) => {
    const player = players.find(p => p.id === playerId)
    if (!player) return false
    return humanPlayer.teamId === player.teamId
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-yellow-400">
          潜江千分 - 团队对抗版
        </h1>
        <button
          onClick={handleResetGame}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-all"
        >
          重新开始
        </button>
      </div>
      
      {/* 分数板 */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="bg-blue-900/50 border border-blue-600 rounded-lg px-6 py-3">
          <div className="text-sm text-blue-300">队伍0</div>
          <div className="text-3xl font-bold text-blue-400">{teamScores.team0}</div>
        </div>
        <div className="bg-green-900/50 border border-green-600 rounded-lg px-6 py-3">
          <div className="text-sm text-green-300">队伍1</div>
          <div className="text-3xl font-bold text-green-400">{teamScores.team1}</div>
        </div>
      </div>
      
      {/* 游戏区域 */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 上方玩家 (AI上) */}
        <div className="flex justify-center">
          <div className="w-80">
            <PlayerSeat
              player={players[2]}
              isCurrent={currentPlayerIndex === 2}
              isPartner={getPartnerInfo(players[2].id)}
              showWind={windPlayerId === players[2].id}
            />
          </div>
        </div>
        
        {/* 中间区域 */}
        <div className="flex justify-between items-start">
          {/* 左侧玩家 (AI左) */}
          <div className="w-64">
            <PlayerSeat
              player={players[1]}
              isCurrent={currentPlayerIndex === 1}
              isPartner={getPartnerInfo(players[1].id)}
              showWind={windPlayerId === players[1].id}
            />
          </div>
          
          {/* 中间：出牌区域 */}
          <div className="flex-1 mx-4">
            <div className="bg-gray-800/50 rounded-lg p-6 min-h-[200px] flex flex-col items-center justify-center">
              {/* 当前轮次提示 */}
              <div className="text-sm text-gray-400 mb-4">
                {isMyTurn ? (
                  <span className="text-yellow-400 font-bold">轮到你了！</span>
                ) : (
                  <span>{currentPlayer?.name} 出牌中...</span>
                )}
              </div>
              
              {/* 出牌区域 */}
              {currentPlay ? (
                <div className="space-y-3">
                  <div className="text-center text-sm text-gray-400">
                    {players.find(p => p.id === currentPlay.playerId)?.name} 出了:
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentPlay.cards.map((card, index) => (
                      <Card key={index} card={card} size="normal" />
                    ))}
                  </div>
                  <div className="text-center">
                    <span className="text-green-400 font-semibold">
                      {currentPlay.type}
                    </span>
                    {currentPlay.scoreValue > 0 && (
                      <span className="ml-2 text-yellow-400">
                        +{currentPlay.scoreValue}分
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-lg">
                  等待出牌...
                </div>
              )}
              
              {/* 连续不要提示 */}
              {passCount > 0 && (
                <div className="mt-4 text-sm text-gray-400">
                  连续 {passCount} 人不要
                </div>
              )}
              
              {/* 吹风提示 */}
              {windPlayerId && (
                <div className="mt-4 text-yellow-400 font-bold flex items-center gap-2">
                  <span>🌬️</span>
                  <span>
                    {players.find(p => p.id === windPlayerId)?.name} 获得吹风权
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* 右侧玩家 (AI右) */}
          <div className="w-64">
            <PlayerSeat
              player={players[3]}
              isCurrent={currentPlayerIndex === 3}
              isPartner={getPartnerInfo(players[3].id)}
              showWind={windPlayerId === players[3].id}
            />
          </div>
        </div>
        
        {/* 下方玩家（你）*/}
        <div className="space-y-4">
          <div className="text-center">
            <PlayerSeat
              player={humanPlayer}
              isCurrent={isMyTurn}
              isPartner={true}
              showWind={windPlayerId === 'human'}
            />
          </div>
          
          <CardHand
            cards={humanPlayer.hand}
            currentPlay={currentPlay}
            onPlayCards={handlePlayCards}
            onPass={handlePass}
            disabled={!isMyTurn || aiThinking}
          />
        </div>
      </div>
      
      {/* 游戏说明 */}
      <div className="fixed bottom-4 right-4 bg-gray-800/90 rounded-lg p-4 max-w-xs text-sm">
        <div className="font-bold mb-2 text-yellow-400">游戏提示</div>
        <ul className="space-y-1 text-gray-300">
          <li>• 点击选择手牌，再点击出牌</li>
          <li>• 对家（相同队伍）需要配合</li>
          <li>• 5、10、K是分数牌</li>
          <li>• 上游或二游的对家获得吹风权</li>
          <li>• 上游+二游团队奖励+60分</li>
        </ul>
      </div>
    </div>
  )
}
