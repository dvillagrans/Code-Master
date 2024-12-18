import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  };

  return (
    <Button variant="outline" size="icon" onClick={toggle}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
