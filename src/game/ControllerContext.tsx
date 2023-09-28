import React, { createContext, useContext, useState } from 'react';

// Define the context type
interface ControllerContextType {
  jump: number;
  setJump: React.Dispatch<React.SetStateAction<number>>;
}

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
  const [jump, setJump] = useState<number>(0);

  const contextValue: ControllerContextType = {
    jump,
    setJump,
  };

  async function handleJump() {    
    setJump(1);
    await new Promise(r => setTimeout(r, 150));
    setJump(2);
    await new Promise(r => setTimeout(r, 500));
    setJump(3);
    await new Promise(r => setTimeout(r, 500));
    setJump(4);
    await new Promise(r => setTimeout(r, 200));
    setJump(0);
  }

  return (
    <ControllerContext.Provider value={contextValue}>
        {children}
        <div className='activable-area' onClick={handleJump}></div>
    </ControllerContext.Provider>
  );
}