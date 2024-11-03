import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  glassColor: string;
  setGlassColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [glassColor, setGlassColor] = useState('#30556b'); // Updated default color

  return (
    <ThemeContext.Provider value={{ glassColor, setGlassColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}