import { useTheme } from "../../context/ThemeContext";
import { Toaster } from 'sonner';
import { BsHouseDoor, BsCode, BsPerson, BsCalendar } from "react-icons/bs";
import { Sun, Moon, Sparkles, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie';
import { toast } from 'sonner';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const NavLink = ({ href, icon: Icon, children }: NavLinkProps) => {
  const [isActive, setIsActive] = useState(false);
  const { isDarkMode } = useTheme(); // Add theme context to NavLink

  useEffect(() => {
    // Actualizar isActive cuando cambie la URL
    const updateActive = () => {
      setIsActive(window.location.pathname === href);
    };
    
    updateActive();
    window.addEventListener('popstate', updateActive);
    
    return () => window.removeEventListener('popstate', updateActive);
  }, [href]);
  
  return (
    <a 
      href={href} 
      className={`flex items-center space-x-2 transition-colors duration-300
        ${isActive 
          ? 'text-indigo-600 dark:text-indigo-400' 
          : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
    >
      <Icon className="text-lg" />
      <span className="font-medium">{children}</span>
    </a>
  );
};

const Header = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const handleLogout = () => {
    try {
      // Limpiar todas las cookies
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('user_data');
      
      // Mostrar mensaje de éxito
      toast.success('Sesión cerrada correctamente');
      
      // Redirigir al login
      window.location.href = '/';
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  useEffect(() => {
    document.body.classList.remove("light", "dark")
    document.body.classList.add(theme)
  }, [theme])

  return (
    <header className="shadow-lg border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <Toaster richColors position='top-left' />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              CodeMaster Pro
            </span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <NavLink href="/events" icon={BsCalendar}>Events</NavLink>
            <NavLink href="/problems" icon={BsCode}>Problems</NavLink>
            <NavLink href="/dashboard" icon={BsPerson}>Profile</NavLink>
            
            <div className="flex items-center space-x-2 border-l pl-6 ml-2 border-gray-200 dark:border-gray-700">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme}
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;