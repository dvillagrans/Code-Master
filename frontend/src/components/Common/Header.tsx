import { useTheme } from "../../context/ThemeContext";
import { Toaster } from 'sonner';
import { BsHouseDoor, BsCode, BsCalendar, BsPerson } from "react-icons/bs";
import { Sun, Moon, Sparkles, LogOut, User, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Cookies from 'js-cookie';
import { toast } from 'sonner';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

// Agregar esta interfaz para los datos del usuario
interface UserData {
  name: string;
  last_name: string;
  email?: string;
  avatar?: string;
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

const UserMenu = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/users/profile/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    try {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('user_data');
      toast.success('Sesión cerrada correctamente');
      window.location.href = '/';
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={userData?.avatar || "/avatars/01.png"} 
              alt={userData?.name || "Usuario"} 
            />
            <AvatarFallback>
              {userData ? userData.name.charAt(0) + userData.last_name.charAt(0) : "UN"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData ? `${userData.name} ${userData.last_name}` : 'Cargando...'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email || 'Cargando...'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
            
            <div className="flex items-center space-x-2 border-l pl-6 ml-2 border-gray-200 dark:border-gray-700">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme}
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <UserMenu />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;