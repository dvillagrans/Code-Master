import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "../context/ThemeContext";
import {
  BsCheckCircle,
  BsLightning,
  BsBook,
  BsClock,
  BsXCircle,
} from "react-icons/bs";
import { Award } from "lucide-react";
import { Clock, BookOpen } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description }) => (
  <div className="p-6 rounded-xl border bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
    <div className="flex items-center space-x-4">
      <Icon className="h-6 w-6 text-blue-500" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-3xl font-bold mt-4 mb-2">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
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
}

const Dash = () => {
  const { isDarkMode } = useTheme();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = Cookies.get("access_token"); // Recuperar el token de las cookies
      if (!accessToken) {
        console.error("No se encontró el token de acceso.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/users/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Agregar el token al encabezado
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
  
          // Transformar los datos para la gráfica
          const transformedProgressData = data.ejercicios_resueltos_ultimos_siete_dias.map(
            (item: { date: string; count: number }) => ({
              day: item.date, // Renombrar `date` a `day`
              problems: item.count, // Renombrar `count` a `problems`
            })
          );
          setProgressData(transformedProgressData);
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
<div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <Header />
      {/* Main Content */}
      <div className="p-8">
        {/* User Profile Header */}
        <div className="rounded-2xl shadow-xl p-6 mb-8 border bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700">
          <div className="flex items-center space-x-6">
            <div className="relative">
            <img
                src={userStats.avatar || "https://ibb.co/5Wy9XrP"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-500/20 transition-all hover:ring-blue-500/40"
              />
              <span className="absolute bottom-0 right-0 block h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                <Award className="h-4 w-4" />
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{`${userStats.name} ${userStats.last_name}`}</h1>
              <p className="flex items-center space-x-2">
                <span>Rango Global:</span>
                <span className="font-semibold text-blue-600">#{userStats.ranking}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8  ">
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

        {/* Progress and Recent Exercises Combined */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Chart */}
<Card
  className={`${
    isDarkMode
      ? "bg-gray-800 border-gray-700"
      : "dark:bg-gray-800 border-slate-200 dark:border-gray-700"
  }`}
>
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
            dataKey="day" // Mapeado a `day`
            stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
          />
          <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#000000",
            }}
          />
          <Line
            type="monotone"
            dataKey="problems" // Mapeado a `problems`
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

           {/* Ejercicios Recientes */}
      <Card
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "dark:bg-gray-800 border-slate-200 dark:border-gray-700"
        }`}
      >
        <CardHeader>
          <CardTitle>Ejercicios Recientes</CardTitle>
          <CardDescription>Últimos problemas trabajados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStats.recentSolutions && userStats.recentSolutions.length > 0 ? (
              userStats.recentSolutions.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{exercise.problem_title}</h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {exercise.language} •{" "}
                        {new Date(exercise.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        exercise.status === "Accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {exercise.status === "Accepted" ? (
                        <BsCheckCircle className="mr-1" />
                      ) : (
                        <BsXCircle className="mr-1" />
                      )}
                      {exercise.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay ejercicios recientes disponibles.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  <Footer/>
</div>
  );
};


export default Dash;