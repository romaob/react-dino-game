import { createContext, useContext, useEffect, useState } from "react";
import { useControllerContext } from "./ControllerContext";

export enum GameStatus {
    INIT,
    RUNNING,
    PAUSED,
    GAME_OVER,
    RESTART,
}

interface GameContextType {
    gameStatus: GameStatus;
    health: number;
    setHealth: (health: number) => void;
    playerColliderRef: React.RefObject<HTMLDivElement> | null;
    setPlayerColliderRef: (ref: React.RefObject<HTMLDivElement>) => void;
    onDamage?: (amount: number) => void;
    setGameStatus: (status: GameStatus) => void;
    attacking: boolean;
    setAttacking: (attacking: boolean) => void;
    score: number;
    setScore?: (score: number) => void;
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
    const [attacking, setAttacking] = useState(false)
    const [score, setScore] = useState(0);

    const onScore = (amount: number) => {
        setScore(score + amount < 0 ? 0 : score + amount);
    }

    const onDamage = (amount: number) => {
        setHealth(health - amount > 0 ? health - amount : 0);
        onScore(-amount);
    }

    const reset = () => {
        setHealth(100);
    }

    function updateHealth(hp: number) {
        if (hp > 100) setHealth(100);
        else if (hp < 0) setHealth(0);
        else setHealth(hp);
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
        if (health === 0) {
            setGameStatus(GameStatus.GAME_OVER);
        }
    }, [health])

    const contextValue: GameContextType = {
        gameStatus,
        health,
        setHealth: updateHealth,
        playerColliderRef,
        setPlayerColliderRef,
        onDamage,
        setGameStatus,
        attacking,
        setAttacking,
        score,
        setScore: onScore,
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
}
