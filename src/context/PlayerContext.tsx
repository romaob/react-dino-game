import { createContext, useContext, useState } from "react";

interface PlayerContextType {
    health: number;
    playerColliderRef: React.RefObject<HTMLDivElement> | null;
    setPlayerColliderRef: (ref: React.RefObject<HTMLDivElement>) => void;
    onDamage?: (amount: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);


export function usePlayerContext() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayerContext must be used within a PlayerProvider');
    }
    return context;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [health, setHealth] = useState(100);
    const [playerColliderRef, setPlayerColliderRef] = useState<React.RefObject<HTMLDivElement> | null>(null);

    const onDamage = (amount: number) => {
        setHealth(health - amount > 0 ? health - amount : 0);
    }

    const contextValue: PlayerContextType = {
        health: health,
        playerColliderRef,
        setPlayerColliderRef,
        onDamage: onDamage
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
        </PlayerContext.Provider>
    );
}
