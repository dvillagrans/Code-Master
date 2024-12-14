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
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import Cookies from 'js-cookie';

interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    username: string;
    email: string;
  };
}

type FormData = {
  name: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const SignUp = () => {
  const form = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFormSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    
    if (!data.terms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
  
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Permite enviar/recibir cookies
        body: JSON.stringify({
          name: data.name,
          last_name: data.lastName,
          email: data.email,
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword,
          terms: data.terms,
        }),
      });
  
      const responseData: AuthResponse = await response.json();
  
      if (response.ok) {
        // Guardar tokens en cookies con nombres consistentes
        Cookies.set('access_token', responseData.access, { 
          expires: 1, // 1 día
          secure: true,
          sameSite: 'Lax'
        });
        
        Cookies.set('refresh_token', responseData.refresh, { 
          expires: 7, // 7 días
          secure: true,
          sameSite: 'Lax'
        });
        
        // Guardar información del usuario
        Cookies.set('user_data', JSON.stringify({
          username: responseData.user.username,
          email: responseData.user.email
        }), {
          expires: 1,
          secure: true,
          sameSite: 'Lax'
        });

        toast.success("Account created successfully!", {
          description: "Redirecting to dashboard...",
        });
  
        // Redirigir después de un pequeño retraso
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
  
        // Restablecer el formulario
        form.reset();
      } else {
        // Manejo de errores del backend
        const errorMessages = Object.entries(responseData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        toast.error("Account creation failed", {
          description: errorMessages,
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Could not create account", {
        description: "Please try again later",
      });
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
                  <Toaster richColors position='top-left' />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  CodeMaster Pro
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
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create password"
                            className="w-full bg-gray-100 dark:bg-gray-800 border-0 pr-10"
                          />
                        </FormControl>
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            className="w-full bg-gray-100 dark:bg-gray-800 border-0 pr-10"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </FormItem>
                    )}
                  />

                  {/* Terms checkbox */}
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the{' '}
                            <Button variant="link" className="p-0 h-auto">Terms of Service</Button>
                            {' '}and{' '}
                            <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
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
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/>
                  </svg>
                  Apple
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

      {/* Preview Section */}
      <div className="hidden lg:block lg:w-7/12 bg-gradient-to-br from-blue-500 to-purple-500 p-12">
        <div className="h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">Join Our Community</h1>
          <h2 className="text-3xl font-semibold mb-8">
            Start your journey with{' '}
            <span className="underline decoration-4 decoration-white/30">
              CodeMaster Pro
            </span>
          </h2>
          <p className="text-lg mb-12 text-white/80 text-center max-w-2xl">
            Join thousands of developers who are already improving their coding skills, 
            participating in challenges, and building amazing projects.
          </p>

          {/* Community Growth Preview */}
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Community Growth</h3>
              <div className="flex space-x-4">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                  Active Users
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-white/60 rounded-full mr-2"></div>
                  New Sign-ups
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
                    dataKey="activeUsers"
                    stroke="#93C5FD"
                    strokeWidth={3}
                    dot={{ fill: '#93C5FD', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newSignups"
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

export default SignUp;