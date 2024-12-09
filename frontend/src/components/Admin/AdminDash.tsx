import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  ComposedChart,
  Legend
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Target, 
  Flame, 
  Trophy, 
  Activity, 
  Book,
  Star,
  TrendingUp,
  Code,
  Clock,
  Medal
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    // Expanded metrics
    totalUsers: 5432,
    activeUsers: 3210,
    avgExercisesCompleted: 18.5,
    avgDailyStreak: 12,
    totalExercises: 75420,
    totalChallenges: 1205,
    avgSessionTime: 45, // minutes
    
    // Enhanced user level and progress data
    userLevels: [
      { name: 'Básico', value: 2500, color: '#3B82F6' },
      { name: 'Intermedio', value: 1800, color: '#6366F1' },
      { name: 'Avanzado', value: 1132, color: '#8B5CF6' }
    ],
    
    // New detailed metrics
    languageDistribution: [
      { language: 'Python', users: 1560, color: '#3B82F6' },
      { language: 'JavaScript', users: 1320, color: '#10B981' },
      { language: 'Java', users: 890, color: '#F43F5E' },
      { language: 'C++', users: 620, color: '#8B5CF6' },
      { language: 'Others', users: 1042, color: '#F97316' }
    ],
    
    // Detailed performance tracking
    weeklyPerformance: [
      { day: 'Lun', exercises: 520, avgTime: 35, difficulty: 2.5 },
      { day: 'Mar', exercises: 610, avgTime: 42, difficulty: 3.2 },
      { day: 'Mié', exercises: 580, avgTime: 38, difficulty: 2.8 },
      { day: 'Jue', exercises: 650, avgTime: 45, difficulty: 3.5 },
      { day: 'Vie', exercises: 700, avgTime: 50, difficulty: 3.7 },
      { day: 'Sáb', exercises: 450, avgTime: 55, difficulty: 4.0 },
      { day: 'Dom', exercises: 380, avgTime: 60, difficulty: 4.2 }
    ],
    
    // Skill progression
    skillProgression: [
      { skill: 'Algoritmos', progress: 75, color: '#3B82F6' },
      { skill: 'Estructuras de Datos', progress: 65, color: '#10B981' },
      { skill: 'Programación Funcional', progress: 55, color: '#F43F5E' },
      { skill: 'Programación Orientada a Objetos', progress: 80, color: '#8B5CF6' },
      { skill: 'Desarrollo Web', progress: 60, color: '#F97316' }
    ],
    
    // Gamification metrics
    leaderboard: [
      { rank: 1, name: 'Juan Pérez', points: 5420, level: 'Avanzado' },
      { rank: 2, name: 'María Gómez', points: 5210, level: 'Avanzado' },
      { rank: 3, name: 'Carlos Ruiz', points: 4980, level: 'Intermedio' },
      { rank: 4, name: 'Ana Martínez', points: 4750, level: 'Intermedio' },
      { rank: 5, name: 'Luis Torres', points: 4520, level: 'Intermedio' }
    ]
  });

  const MetricCard = ({ icon: Icon, title, value, trend, description }: { icon: React.ComponentType<{ className?: string }>, title: string, value: number | string, trend: number, description?: string }) => (
    <Card className="bg-white/10 backdrop-blur-lg border-none text-white group hover:scale-105 transition-transform">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% este mes
        </p>
        {description && <p className="text-xs text-white/60 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-500 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">CodeMaster Pro Dashboard</h1>
            <p className="text-white/80 text-lg">Análisis detallado de tu progreso y rendimiento</p>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="bg-white/10 text-white hover:bg-white/20 flex items-center"
            >
              <TrendingUp className="mr-2 w-4 h-4" /> Exportar Reporte
            </Button>
            <Button 
              className="bg-white/20 text-white hover:bg-white/30 flex items-center"
            >
              <Trophy className="mr-2 w-4 h-4" /> Ver Logros
            </Button>
          </div>
        </header>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard 
            icon={Users} 
            title="Total Usuarios" 
            value={dashboardData.totalUsers} 
            trend={15.2}
            description="Crecimiento constante de la comunidad"
          />
          <MetricCard 
            icon={Activity} 
            title="Usuarios Activos" 
            value={dashboardData.activeUsers} 
            trend={12.5}
            description="Participación activa en plataforma"
          />
          <MetricCard 
            icon={Book} 
            title="Ejercicios Totales" 
            value={dashboardData.totalExercises} 
            trend={20.3}
            description="Desafíos completados"
          />
          <MetricCard 
            icon={Clock} 
            title="Tiempo Promedio" 
            value={`${dashboardData.avgSessionTime} min`} 
            trend={8.7}
            description="Tiempo de sesión promedio"
          />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-lg mb-6">
            <TabsTrigger value="overview">Visión General</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="leaderboard">Clasificación</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Levels Distribution */}
              <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Medal className="mr-2 w-5 h-5" /> Distribución de Niveles
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.userLevels}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => 
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {dashboardData.userLevels.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Language Distribution */}
              <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 w-5 h-5" /> Distribución de Lenguajes
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.languageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="language" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip />
                      <Bar dataKey="users">
                        {dashboardData.languageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weekly Performance */}
              <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 w-5 h-5" /> Rendimiento Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={dashboardData.weeklyPerformance}>
                      <XAxis dataKey="day" scale="band" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Bar dataKey="exercises" barSize={20} fill="#8884d8" />
                      <Line type="monotone" dataKey="difficulty" stroke="#ff7300" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Skill Progression */}
              <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 w-5 h-5" /> Progresión de Habilidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.skillProgression}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="skill" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip />
                      <Bar dataKey="progress">
                        {dashboardData.skillProgression.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 w-5 h-5" /> Tabla de Clasificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {dashboardData.leaderboard.map((user) => (
                    <div 
                      key={user.rank} 
                      className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-colors"
                    >
                      <div className="text-xl font-bold">{user.rank}. {user.name}</div>
                      <div className="text-sm text-white/70">
                        {user.points} puntos
                      </div>
                      <div className="text-xs text-white/50">
                        Nivel {user.level}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;