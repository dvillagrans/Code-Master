import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line } from 'recharts';
import { Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from 'sonner'; // Reemplazar importaciones de toast
import SideContent from './SideContent-SigUp';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Schema de validación
const schema = yup.object({
  name: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup.string()
    .required("Please confirm your password")
    .test("passwords-match", "Passwords must match", function(value) {
      return this.parent.password === value;
    }),
  terms: yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
}).required();

type FormData = yup.InferType<typeof schema>;

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    username: string;
    email: string;
    role: 'admin' | 'user';
  };
}

const SignUp = () => {
  
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const passwordRequirements = {
    minLength: (password: string) => password.length >= 6,
    hasUpperCase: (password: string) => /[A-Z]/.test(password),
    hasNumber: (password: string) => /[0-9]/.test(password),
    hasSpecialChar: (password: string) => /[!@#$%^&*]/.test(password),
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (passwordRequirements.minLength(password)) strength++;
    if (passwordRequirements.hasUpperCase(password)) strength++;
    if (passwordRequirements.hasNumber(password)) strength++;
    if (passwordRequirements.hasSpecialChar(password)) strength++;
    return (strength / 4) * 100;
  };

  const handleRedirect = (role: string) => {
    switch (role) {
      case 'admin':
        window.location.href = '/admin';
        break;
      case 'user':
      default:
        window.location.href = '/dashboard';
        break;
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const formData = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        name: data.name,
        last_name: data.lastName,
        terms: data.terms
      };
  
      console.log('Sending registration data:', formData);
  
      const response = await fetch(`${API_URL}/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
  
      const responseData = await response.json();
      console.log('Server response:', responseData);
  
      if (!response.ok) {
        // Manejar errores de validación
        if (responseData.confirmPassword) {
          toast.error(Array.isArray(responseData.confirmPassword) 
            ? responseData.confirmPassword[0] 
            : responseData.confirmPassword
          );
          return;
        }
  
        // Otros errores
        if (typeof responseData === 'object') {
          const firstError = Object.entries(responseData)[0];
          if (firstError) {
            const [field, messages] = firstError;
            toast.error(Array.isArray(messages) ? messages[0] : messages);
          }
          return;
        }
  
        throw new Error('Registration failed');
      }
  
      // Éxito: Limpiar cookies existentes y guardar nuevas credenciales
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('user_data');
  
      // Guardar nuevas cookies
      if (responseData.access) {
        Cookies.set('access_token', responseData.access, { expires: 1 }); // expira en 1 día
      }
      if (responseData.refresh) {
        Cookies.set('refresh_token', responseData.refresh, { expires: 7 }); // expira en 7 días
      }
      if (responseData.user) {
        Cookies.set('user_data', JSON.stringify(responseData.user), { expires: 7 });
      }
  
      toast.success("¡Cuenta creada exitosamente!");
      window.location.href = '/problems';
      
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : "No se pudo crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample data for the chart - showing user growth metrics
  const chartData = [
    { month: 'Jan', activeUsers: 1200, newSignups: 450 },
    { month: 'Feb', activeUsers: 1800, newSignups: 620 },
    { month: 'Mar', activeUsers: 2400, newSignups: 800 },
    { month: 'Apr', activeUsers: 3100, newSignups: 920 },
    { month: 'May', activeUsers: 3800, newSignups: 1100 },
    { month: 'Jun', activeUsers: 4500, newSignups: 1350 },
    { month: 'Jul', activeUsers: 5200, newSignups: 1500 },
    { month: 'Aug', activeUsers: 5900, newSignups: 1650 },
    { month: 'Sep', activeUsers: 6600, newSignups: 1800 },
    { month: 'Oct', activeUsers: 7500, newSignups: 2000 },
  ];

  return (
    <>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                {/* Logo section */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    CodeMaster
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>
                  Join our community of developers and start your journey
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="First Name" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Last Name" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Username field */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Choose a username" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Email field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Enter your email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Password fields */}
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
                                placeholder="Create password"
                                className="pr-10"
                                onFocus={() => setShowPasswordRequirements(true)}
                                onBlur={() => setShowPasswordRequirements(false)}
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Password Requirements Popover */}
                          {showPasswordRequirements && (
                            <div className="absolute mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 space-y-3 w-80">
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <AlertCircle className="w-4 h-4" />
                                <span>Password must contain:</span>
                              </div>
                              
                              <div className="space-y-2">
                                {/* Progress bar */}
                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
                                    style={{ width: `${getPasswordStrength(field.value)}%` }}
                                  />
                                </div>

                                {/* Requirements list */}
                                <ul className="space-y-1 text-sm">
                                  <li className={`flex items-center gap-2 ${passwordRequirements.minLength(field.value) ? 'text-green-500' : 'text-gray-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.minLength(field.value) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    At least 6 characters
                                  </li>
                                  <li className={`flex items-center gap-2 ${passwordRequirements.hasUpperCase(field.value) ? 'text-green-500' : 'text-gray-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasUpperCase(field.value) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    One uppercase letter
                                  </li>
                                  <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber(field.value) ? 'text-green-500' : 'text-gray-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasNumber(field.value) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    One number
                                  </li>
                                  <li className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar(field.value) ? 'text-green-500' : 'text-gray-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasSpecialChar(field.value) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    One special character (!@#$%^&*)
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                className="pr-10"
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          <FormMessage /> {/* Agregar esta línea */}
                        </FormItem>
                      )}
                    />

                    {/* Terms checkbox */}
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              I agree to the{' '}
                              <Button variant="link" className="p-0 h-auto text-sm font-normal">
                                Terms of Service
                              </Button>
                              {' '}and{' '}
                              <Button variant="link" className="p-0 h-auto text-sm font-normal">
                                Privacy Policy
                              </Button>
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating account...
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
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
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </Button>
                </div>

                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => window.location.href = '/signup' }
                  >
                    Sign in
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <SideContent />
      </div>
    </>
  );
};

export default SignUp;