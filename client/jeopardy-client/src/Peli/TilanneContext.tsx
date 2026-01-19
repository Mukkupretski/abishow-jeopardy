
import React, { createContext, useContext, useState } from "react";

export type Tilanne = {
  opet: number;
  abit: number;
}

type TilanneContextType = {
  value: Tilanne
  setValue: React.Dispatch<React.SetStateAction<Tilanne>>;
};

const TilanneContext = createContext<TilanneContextType | undefined>(undefined);

export const TilanneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [value, setValue] = useState<Tilanne>({ opet: 100, abit: 10 });

  return (
    <TilanneContext.Provider value={{ value, setValue }}>
      {children}
    </TilanneContext.Provider>
  );
};

export const useTilanne = () => {
  const context = useContext(TilanneContext);
  if (!context) {
    throw new Error("Hook useTilanne must be used inside TilanneProvider");
  }
  return context;
};
