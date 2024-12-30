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
import { Clock, BookOpen, Brain, Calendar } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton"
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { HoverCard } from "@/components/ui/hover-card";
import { useInView } from "react-intersection-observer";
import { RiFireLine } from "react-icons/ri";
import { Sparkles, Flame, Target } from "lucide-react";
import ActivityHeatmap from './ActivityHeatmap';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
}

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface UserLevel {
  current: number;
  next: number;
  progress: number;
}

// Componente de nivel y progreso
const LevelProgress = ({ level }: { level: UserLevel }) => (
  <motion.div 
    className="relative p-6 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
  >
    <motion.div 
      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <div className="relative">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-lg font-semibold">Nivel {level.current}</span>
        </div>
        <Badge variant="outline" className="bg-background/50">
          <Flame className="h-3 w-3 mr-1 text-primary" />
          Siguiente: {level.next}
        </Badge>
      </div>
      <Progress 
        value={level.progress} 
        className="h-3"
        style={{
          background: "linear-gradient(90deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--primary-rgb), 0.05) 100%)"
        }}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-muted-foreground">
          {level.progress}% completado
        </span>
        <span className="text-sm text-primary">
          {100 - level.progress}% restante
        </span>
      </div>
    </div>
  </motion.div>
);

// Componente de habilidades
const SkillCard = ({ skill }: { skill: Skill }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-4 rounded-lg border bg-card relative overflow-hidden"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
      animate={{
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4" style={{ color: skill.color }} />
          <span className="font-medium">{skill.name}</span>
        </div>
        <Badge 
          variant="outline"
          style={{ 
            backgroundColor: `${skill.color}15`,
            color: skill.color 
          }}
        >
          Nivel {skill.level}
        </Badge>
      </div>
      <Progress 
        value={skill.level * 10} 
        className="h-2"
        style={{
          background: `${skill.color}15`,
          '--progress-color': skill.color
        } as React.CSSProperties}
      />
    </div>
  </motion.div>
);

// Componente mejorado para StatCard con animación
const StatCard = ({ title, value, icon: Icon, description }: StatCardProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({
        scale: [0.8, 1],
        opacity: [0, 1],
        transition: { duration: 0.5 }
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={controls}
    >
      <HoverCard>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                <Icon className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="space-y-1">
                <motion.p 
                  className="text-sm text-muted-foreground"
                  whileHover={{ color: "hsl(var(--primary))" }}
                >
                  {title}
                </motion.p>
                <motion.h3 
                  className="text-2xl font-bold"
                  initial={{ backgroundPosition: "0%" }}
                  whileHover={{ 
                    backgroundPosition: "100%",
                    transition: { duration: 1 }
                  }}
                  style={{
                    backgroundImage: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)/0.6))",
                    backgroundSize: "200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {value}
                </motion.h3>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverCard>
    </motion.div>
  );
};

// Nuevo componente para logros
const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="relative group"
  >
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <achievement.icon className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <h4 className="font-medium text-sm">{achievement.title}</h4>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
            <Progress value={achievement.progress} className="h-1 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
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
  activityData: { date: string; count: number }[];
}

const DEFAULT_AVATAR = "https://i.ibb.co/5Wy9XrP/default-avatar.png"; // Reemplaza con tu URL de avatar por defecto

const Dash = () => {
  const { isDarkMode } = useTheme();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([
    { name: "Algoritmos", level: 7, color: "#3b82f6" },
    { name: "Estructuras de Datos", level: 6, color: "#10b981" },
    { name: "Matemáticas", level: 5, color: "#8b5cf6" },
    { name: "Optimización", level: 4, color: "#f59e0b" },
  ]);

  const calculateUserLevel = (xp: number): UserLevel => {
    const levelThreshold = 100;
    const currentLevel = Math.floor(xp / levelThreshold) + 1;
    const progress = (xp % levelThreshold) / levelThreshold * 100;
    return {
      current: currentLevel,
      next: currentLevel + 1,
      progress: Math.round(progress)
    };
  };

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
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-12 w-1/3" /> {/* Placeholder del header */}
          <Separator />
  
          {/* Profile Section Skeleton */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Skeleton className="h-28 w-28 rounded-full" />
                <div className="space-y-2 text-center md:text-left">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Separator orientation="vertical" className="h-4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
  
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((_, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all">
                <CardContent className="pt-6 space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
  
          {/* Charts and Recent Activity Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Progress Chart Card Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/3 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
  
            {/* Recent Solutions Card Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div
                      key={index}
                      className="group flex flex-col gap-2 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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

  // Datos de ejemplo para logros
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "Resolvedor Principiante",
      description: "Resuelve 10 problemas",
      icon: Code,
      progress: 60
    },
    // Agrega más logros aquí
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar con información del perfil */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div layout>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative group">
                      <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full opacity-75 group-hover:opacity-100"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <img
                        src={userStats?.avatar || DEFAULT_AVATAR}
                        alt="Profile"
                        className="relative w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">
                        {`${userStats?.name} ${userStats?.last_name}`}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Rango #{userStats?.ranking}
                      </p>
                    </div>
                    <LevelProgress level={calculateUserLevel(userStats?.puntos_experiencia || 0)} />
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                        <Star className="h-4 w-4 text-yellow-500 mb-1" />
                        <span className="text-sm font-medium">{userStats?.puntos_experiencia || 0}</span>
                        <span className="text-xs text-muted-foreground">XP Total</span>
                      </div>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                        <Activity className="h-4 w-4 text-green-500 mb-1" />
                        <span className="text-sm font-medium">{userStats?.racha || 0}</span>
                        <span className="text-xs text-muted-foreground">Racha</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Habilidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {skills.map((skill, index) => (
                  <SkillCard key={index} skill={skill} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Problemas"
                value={userStats?.ejercicios_completados || 0}
                icon={BookOpen}
                description="Ejercicios completados"
              />
              <StatCard
                title="Precisión"
                value={`${userStats?.accuracy || 0}%`}
                icon={BsCheckCircle}
                description="Tasa de aciertos"
              />
              <StatCard
                title="Racha"
                value={`${userStats?.racha || 0} días`}
                icon={BsLightning}
                description="Días consecutivos"
              />
              <StatCard
                title="Tiempo"
                value="45 min"
                icon={Clock}
                description="Promedio por problema"
              />
            </div>

            {/* Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
              {/* Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimos 7 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
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

              {/* Recent Solutions */}
              <Card>
                <CardHeader>
                  <CardTitle>Últimas Soluciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
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

            {/* Achievement Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Logros Desbloqueados</CardTitle>
                <CardDescription>Tu progreso en los desafíos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dash;