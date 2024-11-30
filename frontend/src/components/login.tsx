import React, { useState } from 'react';
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';
import { Toaster, toast } from 'sonner';


const Login = () => {

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/users/token/", {
        email: formData.email, // Cambia a email si el backend lo soporta
        password: formData.password,
      });

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      toast.success(`¡Bienvenido de nuevo, ${formData.email}!`);
      setIsLoading(false);
      window.location.href = "/dashboard";
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.detail || "Credenciales inválidas.");
        } else if (error.request) {
          toast.error("El servidor no está disponible. Intenta más tarde.");
        } else {
          toast.error("Ocurrió un error inesperado.");
        }
      } else {
        toast.error("Ocurrió un error desconocido.");
      }
    }
  };

  // Datos de ejemplo para el gráfico
  const chartData = [
    { month: 'Jan', profit: 65, expenses: 85 },
    { month: 'Feb', profit: 75, expenses: 70 },
    { month: 'Mar', profit: 60, expenses: 65 },
    { month: 'Apr', profit: 45, expenses: 55 },
    { month: 'May', profit: 40, expenses: 50 },
    { month: 'Jun', profit: 35, expenses: 45 },
    { month: 'Jul', profit: 30, expenses: 40 },
    { month: 'Aug', profit: 45, expenses: 60 },
    { month: 'Sep', profit: 35, expenses: 45 },
    { month: 'Oct', profit: 50, expenses: 65 },
  ];

  return (
    <div className="min-h-screen w-full flex">
      {/* Login Section */}
      <div className="w-full lg:w-5/12 p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 00-7.07 17.07A10 10 0 1012 2z"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              CodeMaster Pro
            </span>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Welcome back! Please enter your details
              </p>
            </div>


            <div className="space-y-4">
                <div>
                <Toaster richColors position='top-left' />
                <div className="space-y-4 relative">
                  <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-100 dark:bg-gray-800 border-0"
                  onChange={handleChange}
                  onClick={() => toast.dismiss('Invalid email')}
                  />

                  <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-100 dark:bg-gray-800 border-0 pr-10"
                    onChange={handleChange}
                  onClick={() => toast.dismiss('Invalid password')}

                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                    ) : (
                    <Eye className="w-5 h-5" />
                    )}
                  </button>
                  </div>
                </div>
                </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-500 dark:text-gray-400"
                  >
                    Remember for 30 days
                  </label>
                </div>
                <Button
                  variant="link"
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password
                </Button>
              </div>

              <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>


              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    OR
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/>
                  </svg>
                  Apple
                </Button>
              </div>
            </div>

            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
                <Button
                variant="link"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => window.location.href = '/signup'}
                >
                Sign up
                </Button>
            </p>
          </div>
          </form>
        </div>
      </div>


      {/* Preview Section */}
      <div className="hidden lg:block lg:w-7/12 bg-gradient-to-br from-blue-500 to-purple-500 p-12">
        <div className="h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
          <h2 className="text-3xl font-semibold mb-8">
            Please sign in to your{' '}
            <span className="underline decoration-4 decoration-white/30">
              CodeMaster Pro
            </span>{' '}
            account
          </h2>
          <p className="text-lg mb-12 text-white/80 text-center max-w-2xl">
            Access your dashboard, track your progress, and continue your learning journey with our comprehensive coding exercises and challenges.
          </p>

          {/* Dashboard Preview */}
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Sales Report</h3>
              <div className="flex space-x-4">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                  Profit
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-white/60 rounded-full mr-2"></div>
                  Expenses
                </span>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#93C5FD"
                    strokeWidth={3}
                    dot={{ fill: '#93C5FD', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth={3}
                    dot={{ fill: 'rgba(255,255,255,0.8)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Indicator Dots */}
          <div className="flex space-x-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;