import { useTheme } from "../../context/ThemeContext";
import { Toaster } from 'sonner';
import { BsHouseDoor, BsCode, BsCalendar, BsPerson } from "react-icons/bs";
import { Sun, Moon, Sparkles, LogOut, User, Settings, Flame } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

// Actualizar la interfaz UserData
interface UserData {
  name: string;
  last_name: string;
  email?: string;
  avatar?: string;
  racha: number;
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

// Agregar el componente StreakIndicator
const StreakIndicator = ({ streak }: { streak: number }) => {
  const isActive = streak > 0;
  
  if (!isActive) return null;
  
  return (
    <div className="absolute -right-7 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full p-[2px] shadow-lg group">
      <div className="bg-background dark:bg-gray-800 rounded-full p-1.5 relative">
        <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap">
          {streak} días seguidos
        </div>
      </div>
    </div>
  );
};

const UserMenu = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const DEFAULT_AVATAR = "https://i.ibb.co/5Wy9XrP/default-avatar.png"; // URL de avatar por defecto

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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent pr-8">
          <Avatar className="h-full w-full">
            <AvatarImage 
              src={userData?.avatar || DEFAULT_AVATAR} 
              alt={userData?.name || "Usuario"} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_AVATAR;
              }}
            />
            <AvatarFallback>
              {userData ? userData.name.charAt(0) + userData.last_name.charAt(0) : "UN"}
            </AvatarFallback>
          </Avatar>
          <StreakIndicator streak={userData?.racha || 0} />
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
            {userData?.racha && userData.racha > 0 && (
              <p className="text-xs font-medium text-orange-500 flex items-center gap-1 mt-1">
                <Flame className="h-3 w-3" />
                Racha de {userData.racha} días
              </p>
            )}
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