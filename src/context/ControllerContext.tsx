import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Define the context type
interface ControllerContextType {
  jumpValue: number;
  isJumping: boolean;
}

var jumpingBlocked = false;

// Create the context with initial values
const ControllerContext = createContext<ControllerContextType | undefined>(undefined);

// Create a custom hook to access the context values
export function useControllerContext() {
  const context = useContext(ControllerContext);
  if (!context) {
    throw new Error('useControllerContext must be used within a ControllerProvider');
  }
  return context;
}

// Create a provider component to wrap your app
export function ControllerProvider({ children }: { children: React.ReactNode }) {
  const [jumpValue, setJumpValue] = useState<number>(0);
  const [isJumping, setIsJumping] = useState(false);

  const contextValue: ControllerContextType = {
    jumpValue,
    isJumping,
  };

  const onClick = () =>{
    handleJump();
  }

  const  handleJump = useCallback(
    async () => {
      if (jumpingBlocked) return;
      jumpingBlocked = true;
      setIsJumping(true);
      setJumpValue(1);
      await new Promise(r => setTimeout(r, 70));
      setJumpValue(2);
      await new Promise(r => setTimeout(r, 500));
      setJumpValue(3);
      await new Promise(r => setTimeout(r, 500));
      setIsJumping(false);
      setJumpValue(4);
      jumpingBlocked = false;
      await new Promise(r => setTimeout(r, 70));
      setJumpValue(0);
    },
    [],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            handleJump();
          }
    },
    [handleJump],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <ControllerContext.Provider value={contextValue}>
        {children}
        <div className='activable-area' onClick={onClick}></div>
    </ControllerContext.Provider>
  );
}