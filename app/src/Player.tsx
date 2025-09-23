import React, { useCallback } from 'react'
import './Player.css'
import { computeIncome, selectPlayerHovered, setPlayerHoveredId, YOUR_PLAYER_ID, type Player as PlayerType } from './app/gameSlice'
import { useAppDispatch, useAppSelector } from './app/hooks'

interface PlayerProps {
    player: PlayerType
}

const Player: React.FC<PlayerProps> = ({ player }) => {
    const dispatch = useAppDispatch()
    const playerHovered = useAppSelector(selectPlayerHovered)

    const onClick = useCallback(() => {
        dispatch(setPlayerHoveredId(player.id))
    }, [dispatch, player.id])

    return (
        <div
            className={`player-box ${(playerHovered && player.id === playerHovered.id) || (playerHovered === null && player.id === YOUR_PLAYER_ID) ? 'highlighted' : ''}`}
            onClick={onClick}
        >
            <div className="player-name">
                {player.name}
                {player.id !== YOUR_PLAYER_ID
                    ? ` (${player.strategy})`
                    : ` (vous)`}
            </div>
            <div className="player-stats">
                <div className="player-stat">
                    <span>Revenu&nbsp;: </span>
                    <span>{computeIncome(player)}</span>
                </div>
                <div className="player-stat">
                    <span>Score&nbsp;: </span>
                    <span>{player.score}</span>
                </div>
                <div className="player-stat">
                    <span>Pollution&nbsp;: </span>
                    <span>{player.pollution}</span>
                </div>
            </div>
        </div>
    )
}

export default Player
