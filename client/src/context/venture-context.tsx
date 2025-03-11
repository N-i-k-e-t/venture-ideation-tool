import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VentureIdea {
  id: number;
  userId: number;
  title: string;
  currentStage: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface VentureContextType {
  currentVenture: VentureIdea | null;
  setCurrentVenture: (venture: VentureIdea | null) => void;
}

const VentureContext = createContext<VentureContextType | undefined>(undefined);

export function VentureProvider({ children }: { children: ReactNode }) {
  const [currentVenture, setCurrentVenture] = useState<VentureIdea | null>(null);

  return (
    <VentureContext.Provider value={{ currentVenture, setCurrentVenture }}>
      {children}
    </VentureContext.Provider>
  );
}

export function useVenture() {
  const context = useContext(VentureContext);
  if (context === undefined) {
    throw new Error('useVenture must be used within a VentureProvider');
  }
  return context;
}
