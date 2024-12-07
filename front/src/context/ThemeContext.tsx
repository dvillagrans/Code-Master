import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("theme") === "dark";
      }
      return false;
    });
  
    useEffect(() => {
      console.log("Estado inicial del tema:", isDarkMode); // Confirmar estado inicial
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [isDarkMode]);
  
    const toggleTheme = () => {
      setIsDarkMode((prev) => {
        const newValue = !prev;
        console.log("Nuevo valor del tema (toggle):", newValue); // Confirmar cambio
        if (newValue) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
        return newValue;
      });
    };
  
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };

export const useTheme = () => useContext(ThemeContext);