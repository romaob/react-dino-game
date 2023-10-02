import { createContext, useContext, useEffect, useState } from "react";
import { useControllerContext } from "./ControllerContext";

export enum GameStatus {
    INIT,
    RUNNING,
    GAME_OVER,
    RESTART,
}

interface GameContextType {
    gameStatus: GameStatus;
    health: number;
    playerColliderRef: React.RefObject<HTMLDivElement> | null;
    setPlayerColliderRef: (ref: React.RefObject<HTMLDivElement>) => void;
    onDamage?: (amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);


export function useGameContext() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
    const {jumpValue} = useControllerContext();
    const [health, setHealth] = useState(100);
    const [playerColliderRef, setPlayerColliderRef] = useState<React.RefObject<HTMLDivElement> | null>(null);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.INIT);

    const onDamage = (amount: number) => {
        setHealth(health - amount > 0 ? health - amount : 0);
        if (health === 0) {
            setGameStatus(GameStatus.GAME_OVER);
        }
    }

    const reset = () => {
        setHealth(100);
    }

    useEffect(() => {
        if (jumpValue !== 1) return;
        if (gameStatus === GameStatus.INIT) {
            setGameStatus(GameStatus.RUNNING);
            return;
        }
        if (gameStatus === GameStatus.GAME_OVER) {
            setGameStatus(GameStatus.RESTART);
            return;
        }
    }, [jumpValue])

    useEffect(() => {
      if (gameStatus === GameStatus.RESTART) {
        reset();
        setGameStatus(GameStatus.RUNNING);
      }
    }, [gameStatus])
    
    useEffect(() => {
        if (jumpValue !== 1) return;
        if (gameStatus === GameStatus.RUNNING || gameStatus === GameStatus.RESTART)
            return;
        if (gameStatus === GameStatus.INIT) {
            setGameStatus(GameStatus.RUNNING);
        }
        if (gameStatus === GameStatus.GAME_OVER) {
            //reset();
            setGameStatus(GameStatus.RESTART);
        }
    }, [jumpValue])

    const contextValue: GameContextType = {
        gameStatus,
        health,
        playerColliderRef,
        setPlayerColliderRef,
        onDamage,
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
}
