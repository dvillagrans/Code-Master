import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Users,
  TrendingUp,
  Brain,
  Search,
  Filter,
  Calendar,
  Star,
  Clock,
  Activity,
  BarChart,
  BookOpen
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchUserProfile, logout } from '../services/auth';
import axiosInstance from '../lib/axiosConfig';

const Dash = () => {

  



  // Datos de ejemplo para el gráfico de progreso
  const progressData = [
    { day: 'Lun', problems: 4 },
    { day: 'Mar', problems: 6 },
    { day: 'Mie', problems: 3 },
    { day: 'Jue', problems: 8 },
    { day: 'Vie', problems: 5 },
    { day: 'Sab', problems: 7 },
    { day: 'Dom', problems: 9 }
  ];

  const problems = [
    {
      id: 1,
      title: "Optimización de Matrices",
      difficulty: "Avanzado",
      category: "Álgebra Lineal",
      status: "En Progreso",
      completion: 65,
      xp: 150,
      timeEstimate: "45 min",
      attempts: 12,
      successRate: "78%"
    },
    {
      id: 2,
      title: "Procesamiento de Datos",
      difficulty: "Intermedio",
      category: "Data Science",
      status: "Completado",
      completion: 100,
      xp: 120,
      timeEstimate: "30 min",
      attempts: 45,
      successRate: "92%"
    },
    {
      id: 3,
      title: "NLP Avanzado",
      difficulty: "Experto",
      category: "Machine Learning",
      status: "Nuevo",
      completion: 0,
      xp: 200,
      timeEstimate: "60 min",
      attempts: 8,
      successRate: "45%"
    }
  ];

  /* 
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Básico': 'bg-green-500/10 text-green-500',
      'Intermedio': 'bg-yellow-500/10 text-yellow-500',
      'Avanzado': 'bg-orange-500/10 text-orange-500',
      'Experto': 'bg-red-500/10 text-red-500'
    };
    return colors[difficulty] || 'bg-blue-500/10 text-blue-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Nuevo': 'bg-blue-500/10 text-blue-500',
      'En Progreso': 'bg-yellow-500/10 text-yellow-500',
      'Completado': 'bg-green-500/10 text-green-500'
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500';
  };
*/
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="backdrop-blur-lg bg-gray-900/50 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Brain className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              CodeMaster Pro
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold">2,450 XP</span>
            </div>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Mi Perfil
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
                <div>
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-gray-400">Ejercicios Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Activity className="h-10 w-10 text-green-500" />
                <div>
                  <p className="text-3xl font-bold">92%</p>
                  <p className="text-gray-400">Tasa de Éxito</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-10 w-10 text-orange-500" />
                <div>
                  <p className="text-3xl font-bold">15</p>
                  <p className="text-gray-400">Racha Actual</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-10 w-10 text-purple-500" />
                <div>
                  <p className="text-3xl font-bold">42h</p>
                  <p className="text-gray-400">Tiempo Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="mb-8 bg-gray-800/50 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Progreso Semanal</CardTitle>
            <CardDescription className="text-gray-400">
              Ejercicios completados en los últimos 7 días
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="problems"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Problems Section */}
        <Card className="bg-gray-800/50 border border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold">Ejercicios Disponibles</CardTitle>
                <CardDescription className="text-gray-400">
                  Explora y practica con nuevos desafíos
                </CardDescription>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Buscar</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filtros</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="group p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{problem.title}</h3>
                        {/*<Badge className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        <Badge className={getStatusColor(problem.status)}>
                          {problem.status}
                        </Badge>
                        */}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{problem.category}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{problem.timeEstimate}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{problem.attempts} intentos</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <BarChart className="h-4 w-4" />
                          <span>{problem.successRate} tasa de éxito</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className="text-sm font-semibold text-blue-400">+{problem.xp} XP</span>
                      </div>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        {problem.status === 'Completado' ? 'Ver Solución' : 'Empezar'}
                      </Button>
                    </div>
                  </div>
                  {problem.status === 'En Progreso' && (
                    <div className="mt-4">
                      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${problem.completion}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 mt-1">
                        {problem.completion}% completado
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dash;