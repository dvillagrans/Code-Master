import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { useTheme } from "../context/ThemeContext";
import {
  BsCheckCircle,
  BsLightning,
  BsBook,
  BsClock,
  BsXCircle,
} from "react-icons/bs";
import { Award, Trophy, Star, Activity, Code, CheckCircle, XCircle } from "lucide-react";
import { Clock, BookOpen,  } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,

} from "recharts";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}

// Actualizar StatCard para un diseño más moderno
const StatCard = ({ title, value, icon: Icon, description }: StatCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <CardContent className="pt-6">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Define la interfaz para los datos del usuario
interface UserStats {
  name: string;
  last_name: string;
  ranking: number;
  racha: number;
  ejercicios_completados: number;
  accuracy: number;
  avatar?: string;
  ejercicios_resueltos_ultimos_siete_dias ?: number;
  recentSolutions?: { id: number; problem_title: string; language: string; created_at: string; status: string }[];
  puntos_experiencia: number;
}

const DEFAULT_AVATAR = "https://i.ibb.co/5Wy9XrP/default-avatar.png"; // Reemplaza con tu URL de avatar por defecto

const Dash = () => {
  const { isDarkMode } = useTheme();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        console.error("No se encontró el token de acceso.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/users/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
          
          // Transformar los datos para la gráfica
          if (Array.isArray(data.ejercicios_resueltos_ultimos_siete_dias)) {
            const transformedProgressData = data.ejercicios_resueltos_ultimos_siete_dias.map(
              (item: { date: string; count: number }) => ({
                day: new Date(item.date).toLocaleDateString('es-ES', { weekday: 'short' }),
                problems: item.count
              })
            );
            setProgressData(transformedProgressData);
          } else {
            console.error("Los datos de ejercicios no tienen el formato esperado");
            setProgressData([]);
          }
        } else {
          console.error("Error al obtener los datos del usuario.");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error al cargar los datos del usuario.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={userStats.avatar || DEFAULT_AVATAR}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-primary/20 transition-all group-hover:ring-primary/40"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_AVATAR;
                  }}
                />
                <span className="absolute bottom-0 right-0 block h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  <Award className="h-4 w-4" />
                </span>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight">
                  {`${userStats?.name} ${userStats?.last_name}`}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Rango Global: #{userStats?.ranking}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {userStats?.puntos_experiencia || 0} puntos
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Problemas Resueltos"
            value={userStats.ejercicios_completados}
            icon={BookOpen}
            description="Total de ejercicios completados"
          />
          <StatCard
            title="Racha Actual"
            value={`${userStats.racha} días`}
            icon={BsLightning}
            description="Días consecutivos resolviendo problemas"
          />
          <StatCard
            title="Precisión"
            value={`${userStats.accuracy}%`}
            icon={BsCheckCircle}
            description="Tasa de soluciones correctas"
          />
          <StatCard
            title="Tiempo Promedio"
            value="45 min"
            icon={Clock}
            description="Tiempo promedio por problema"
          />
        </div>

        {/* Charts and Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Progress Chart Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Progreso Semanal
              </CardTitle>
              <CardDescription>
                Tu actividad de resolución de problemas en los últimos 7 días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <defs>
                      <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-sm text-muted-foreground" />
                    <YAxis className="text-sm text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="problems"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#progressGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Solutions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Ejercicios Recientes
              </CardTitle>
              <CardDescription>
                Últimas soluciones enviadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {userStats?.recentSolutions?.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="group flex flex-col gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium leading-none">{exercise.problem_title}</h3>
                        <Badge variant={exercise.status === "Accepted" ? "default" : "destructive"}>
                          {exercise.status === "Accepted" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {exercise.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Code className="h-3 w-3" />
                          {exercise.language}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(exercise.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dash;