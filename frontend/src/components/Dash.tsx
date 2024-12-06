import { useTheme } from "../context/ThemeContext";
import {
  BsCheckCircle,
  BsXCircle,
  BsLightning,
  BsCalendarCheck
} from "react-icons/bs";
import { Award } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, BookOpen, Clock, Users, BarChart } from "react-feather";
import Header from "./Header";

const Dash = () => {
  const { isDarkMode } = useTheme();

  const userStats = {
    name: "Juan Pérez",
    rank: 1542,
    problemsSolved: 247,
    streakDays: 15,
    accuracy: 84,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
  };

  const progressData = [
    { day: "Lun", problems: 5 },
    { day: "Mar", problems: 3 },
    { day: "Mie", problems: 7 },
    { day: "Jue", problems: 4 },
    { day: "Vie", problems: 6 },
    { day: "Sab", problems: 2 },
    { day: "Dom", problems: 5 }
  ];

  const recentExercises = [
    {
      id: 1,
      name: "Fibonacci Sequence",
      difficulty: "Medium",
      status: "Completed",
      date: "2024-03-15"
    },
    {
      id: 2,
      name: "Binary Search",
      difficulty: "Easy",
      status: "Failed",
      date: "2024-03-14"
    },
    {
      id: 3,
      name: "Tree Traversal",
      difficulty: "Hard",
      status: "Completed",
      date: "2024-03-13"
    }
  ];

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
  }

  const StatCard = ({ title, value, icon: Icon, description }: StatCardProps) => (
    <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "dark:bg-gray-800 border-slate-200 dark:border-gray-700"}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 dark: "text-gray-400" : "text-gray-500"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs dark: "text-gray-400" : "text-gray-500"}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Main Content */}
      <div className="p-8">
        {/* User Profile Header */}
        <div className="rounded-2xl shadow-xl p-6 mb-8 border bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={userStats.avatar}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-500/20 transition-all hover:ring-blue-500/40"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/112";
                }}
              />
              <span className="absolute bottom-0 right-0 block h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                <Award className="h-4 w-4" />
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{userStats.name}</h1>
              <p className="flex items-center space-x-2">
                <span>Rango Global:</span>
                <span className="font-semibold text-blue-600">#{userStats.rank}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8  ">
          <StatCard
            title="Problemas Resueltos"
            value={userStats.problemsSolved}
            icon={BookOpen}
            description="Total de ejercicios completados"
          />
          <StatCard
            title="Racha Actual"
            value={`${userStats.streakDays} días`}
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

        {/* Progress and Recent Exercises Combined */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Chart */}
          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "dark:bg-gray-800 border-slate-200 dark:border-gray-700"}`}>
            <CardHeader>
              <CardTitle>Progreso Semanal</CardTitle>
              <CardDescription>Problemas resueltos por día</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
                    />
                    <XAxis 
                      dataKey="day" 
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"} 
                    />
                    <YAxis 
                      stroke={isDarkMode ? "#9ca3af" : "#6b7280"} 
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#000000"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="problems"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Exercises */}
          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "dark:bg-gray-800 border-slate-200 dark:border-gray-700"}`}>
            <CardHeader>
              <CardTitle>Ejercicios Recientes</CardTitle>
              <CardDescription>Últimos problemas trabajados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {exercise.difficulty} • {exercise.date}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exercise.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {exercise.status === "Completed" ? (
                          <BsCheckCircle className="mr-1" />
                        ) : (
                          <BsXCircle className="mr-1" />
                        )}
                        {exercise.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dash;