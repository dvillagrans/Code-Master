import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

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

const Footer = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  useEffect(() => {
    document.body.classList.remove("light", "dark")
    document.body.classList.add(theme)
  }, [theme])

  return (
    <footer 
      className="
        container mx-auto px-6 py-12 
        border-t border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        transition-colors duration-300
      "
    >
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} DataScience Club. 
          Todos los derechos reservados.
        </div>
        
        <div className="flex items-center space-x-4">
            <a href="/terms">
            <Button variant="ghost" size="sm">
              Términos
            </Button>
            </a>
          
          <a href="/privacy">
            <Button variant="ghost" size="sm">
              Privacidad
            </Button>
          </a>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
            >
              <a 
                href="https://github.com/your-org" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
            >
              <a
                href="https://linkedin.com/company/your-org" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
            >
              <a
                href="https://twitter.com/your-org" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;