import React, { useEffect } from 'react'
import "./GameLoader.css"
import { useAppDispatch, useAppSelector } from './app/hooks'
import { selectLoadingStatus, setLoadingStarted } from './app/gameSlice'

interface GameLoaderProps {
    children: React.ReactNode
}

const GameLoader: React.FC<GameLoaderProps> = ({ children }) => {
    const loadingStatus = useAppSelector(selectLoadingStatus)
    const dispatch = useAppDispatch()

    // Ensure loading state is cleared after the first render
    useEffect(() => {
        setTimeout(() => {
            if (loadingStatus === 'idle') {
                dispatch(setLoadingStarted())
            }
        }, 10);
    }, [loadingStatus]) // Empty dependency array ensures this runs only once

    return (
        <div className="game-loader">
            {['idle', 'loading'].includes(loadingStatus) && (
                <div className="game-loading">
                    <div>Chargement...</div>
                </div>
            )}
            {['loading', 'loaded'].includes(loadingStatus) && children}
        </div>
    )
}

export default GameLoader
