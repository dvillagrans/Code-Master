import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Sun, Moon } from "lucide-react";

const PublicHeader = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Tukey
            </span>
          </div>

            <div className="flex items-center gap-4">
            <a href="/signup">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
              Iniciar Sesión
              </Button>
            </a>
            <a href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              Registrarse
              </Button>
            </a>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme}
              className="ml-2"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            </div>
        </div>
      </div>
    </header>
  );
};


export default PublicHeader;