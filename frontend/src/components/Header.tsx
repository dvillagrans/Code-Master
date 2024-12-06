import { useTheme } from "../context/ThemeContext";
import { Toaster } from 'sonner';
import { BsHouseDoor, BsCode, BsPerson } from "react-icons/bs";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="shadow-lg border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <Toaster richColors position='top-left' />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              CodeMaster Pro
            </span>
          </div>
          
          <nav className="flex items-center space-x-8">
            <NavLink href="/" icon={BsHouseDoor}>Home</NavLink>
            <NavLink href="/problems" icon={BsCode}>Problems</NavLink>
            <NavLink href="/dashboard" icon={BsPerson}>Profile</NavLink>
            
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;