import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para autenticar al usuario
    console.log("Iniciando sesión con:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-md shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-gray-700 text-white"
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="bg-gray-700 text-white"
          />
          <Button type="submit" className="bg-purple-600 w-full">
            Iniciar Sesión
          </Button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          ¿No tienes cuenta? <a href="#" className="text-purple-500">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
