import { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Eye, EyeOff } from 'lucide-react';
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from 'sonner'; // Reemplaza las importaciones anteriores de toast
import SideContent from './SideContent-Inicio';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Definir el esquema de validación
const schema = yup.object({
  username: yup
    .string()
    .required("El usuario o email es requerido")
    .min(3, "El usuario debe tener al menos 3 caracteres"),
  password: yup
    .string()
    .required("La contraseña es requerida")
    .min(3, "La contraseña debe tener al menos 6 caracteres")
}).required();

type FormData = yup.InferType<typeof schema>;

// Agregar interface para la respuesta del login
interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  email: string;
  role: 'admin' | 'user';  // Agregar el rol del usuario
}

const InicioS = () => {

const loginWithGitHub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    const response = await fetch(`${API_URL}/users/third-party-login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(`¡Bienvenido, ${result.user.displayName || result.user.email}!`);
      handleRedirect(data.role); // Usar la nueva función de redirección
    } else {
      // Manejamos diferentes tipos de errores del backend
      switch (data.detail) {
        case "account_exists":
          toast.error("Esta cuenta ya está vinculada a otro método de inicio de sesión.");
          break;
        case "email_exists":
          toast.error("Ya existe una cuenta con este correo electrónico.");
          break;
        default:
          toast.error(data.detail || "Error al iniciar sesión con GitHub");
      }
    }
  } catch (error: any) {
    // Manejamos errores específicos de Firebase
    if (error.code === 'auth/popup-closed-by-user') {
      toast.error("Inicio de sesión cancelado por el usuario");
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      toast.error("Ya existe una cuenta con este correo. Intenta con otro método de inicio de sesión.");
    } else {
      console.error("Error en GitHub Login:", error);
      toast.error("Ocurrió un error durante el inicio de sesión con GitHub");
    }
  }
};

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const response = await fetch(`${API_URL}/users/firebase-auth/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token: idToken }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(`¡Bienvenido, ${result.user.displayName || result.user.email}!`);
      handleRedirect(data.role); // Usar la nueva función de redirección
    } else {
      // Manejo de errores del backend
      switch (data.detail) {
        case "google_required":
          toast.error("Tu cuenta está vinculada con Google. Por favor, usa Google para iniciar sesión.");
          break;
        case "github_required":
          toast.error("Tu cuenta está vinculada con GitHub. Por favor, usa GitHub para iniciar sesión.");
          break;
        case "email_exists":
          toast.error("Ya existe una cuenta con este correo electrónico.");
          break;
        default:
          toast.error("Error al iniciar sesión. Por favor, intenta de nuevo.");
      }
    }
  } catch (error) {
    // Manejo de errores específicos de Firebase
    if ((error as any).code === "auth/popup-closed-by-user") {
      toast.error("Inicio de sesión cancelado por el usuario.");
    } else if ((error as any).code === "auth/account-exists-with-different-credential") {
      toast.error("Ya existe una cuenta con este correo. Intenta con otro método de inicio de sesión.");
    } else {
      console.error("Error en Google Login:", error);
      toast.error("Ocurrió un error durante el inicio de sesión con Google.");
    }
  }
};


  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRedirect = (role: string) => {
    switch (role) {
      case 'admin':
        window.location.href = '/admin';
        break;
      case 'user':
        window.location.href = '/problems';
        break;
      default:
        window.location.href = '/problems';
        break;
    }
  };

  const handleLogin = async (data: FormData) => {
    setIsLoading(true);
  
    try {
      console.log('Enviando solicitud de inicio de sesión:', {
        username: data.username,
        password: data.password,
      });
  
      const response = await axios.post<LoginResponse>(
        `${API_URL}/users/token/`,
        {
          username: data.username,
          password: data.password,
        },
        { 
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      console.log('Respuesta del servidor:', response.data);
  
      if (response.data.access && response.data.refresh) {
        // Guardar los tokens en cookies
        Cookies.set("access_token", response.data.access, {
          expires: 1
        });
  
        Cookies.set("refresh_token", response.data.refresh, {
          expires: 7
        });
  
        // Guardar información del usuario
        const userData = {
          username: response.data.username,
          email: response.data.email,
          role: response.data.role
        };
  
        Cookies.set('user_data', JSON.stringify(userData), {
          expires: 1
        });
  
        toast.success(`¡Bienvenido de nuevo, ${response.data.username}!`);
  
        console.log('Tokens guardados:', {
          access: Cookies.get('access_token'),
          refresh: Cookies.get('refresh_token'),
          userData: Cookies.get('user_data')
        });
  
        handleRedirect(response.data.role);
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      setIsLoading(false);
  
      toast.error(error.response?.data?.detail || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Login Section */}
        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 00-7.07 17.07A10 10 0 1012 2z"></path>
                    </svg>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    CodeMaster
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <CardDescription>
                  Welcome back! Please enter your details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username or Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter your username or email"
                              className={`${form.formState.errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500">
                            {form.formState.errors.username?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className={`${form.formState.errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <FormMessage className="text-red-500">
                            {form.formState.errors.password?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

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
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                      OR
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={loginWithGoogle}
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
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={loginWithGitHub}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </Button>
                </div>
                
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                  <Button
                  variant="link"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => window.location.href = '/register'}
                  >
                  Sign up
                  </Button>
              </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        {/* Image Section */}
          <SideContent  />
      </div>
    </>
  );
}

export default InicioS;