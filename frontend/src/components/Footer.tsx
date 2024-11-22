import React from "react";
import { Github } from "lucide-react";
import { Button } from "./ui/button";

const Footer: React.FC = () => {
  return (
    <footer className="container mx-auto px-6 py-12 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © 2024 DataScience Club. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6">
            <Button variant="ghost" size="sm">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button variant="ghost" size="sm">Términos</Button>
            <Button variant="ghost" size="sm">Privacidad</Button>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
