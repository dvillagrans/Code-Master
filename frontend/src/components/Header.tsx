import React from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "./ui/button";


const Header: React.FC = () => {
  return (
    <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="../../public/tukey_mascota.png" alt="Tukey Logo" className="h-12 w-12" />
            <span className="text-2xl font-bold text-gray-900">Tukey</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost">Sobre Nosotros</Button>
            <Button variant="ghost">Programas</Button>
            <Button variant="ghost">Recursos</Button>
            <Button variant="ghost">Contacto</Button>
            <Button>Únete Ahora</Button>
          </nav>
        </div>
      </header>
  );
};

export default Header;
