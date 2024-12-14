import React, { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { 
  Search,
  Filter, 
  Star, 
  CheckCircle, 
  Clock, 
  Code, 
  Trophy, 
  Sun, 
  Moon,
  ListTree,
  Calculator,
  Database,
  Braces,
  Network,
  WebhookIcon,
  Cpu,
  PanelsTopLeft,
  PieChart,
  AlignVerticalJustifyCenter,
  BarChart,
  Brain,
  Camera,
  Gamepad,
  Wrench,
  Server,
  Sigma,
  Globe,
  LayoutDashboard,
  List,
  Text,
  Link,
  Share2,
  MessageCircle,
  Image,
  Repeat,
  TrendingUp,
  Package,
  Grid,
  HardDrive,
  Shield,
  Briefcase,
  Activity
} from 'lucide-react';

import { RiSettings4Fill as Gears } from "react-icons/ri";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "../../hooks/use-toast"
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils" // Asegúrate de agregar esta importación

const ProblemsList = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [problems, setProblems] = useState<Problem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [completionFilter, setCompletionFilter] = useState("all")
  const [topUsers, setTopUsers] = useState<{username: string, points: number}[]>([])
  const [progressStats, setProgressStats] = useState({
    total: { completed: 0, total: 0 },
    easy: { completed: 0, total: 0 },
    medium: { completed: 0, total: 0 },
    hard: { completed: 0, total: 0 }
  });

  interface Problem {
    id: number
    title: string
    description: string
    difficulty: string
    category: string
    completed: boolean
    timeLimit: string
    points: number

  }
   // Enhanced categories with icons
   const categoriesWithIcons = [
    { name: "All", icon: LayoutDashboard },
    { name: "Arrays", icon: List },
    { name: "Strings", icon: Text },
    { name: "Linked Lists", icon: Link },
    { name: "Mathematics", icon: Calculator },
    { name: "Data Structures", icon: Database },
    { name: "Algorithms", icon: Cpu },
    { name: "Statistics", icon: PieChart },
    { name: "Dynamic Programming", icon: Activity },
    { name: "Graph Theory", icon: Share2 },
    { name: "Fundamentos de Ciencia de Datos", icon: BarChart },
    { name: "Machine Learning", icon: Cpu },
    { name: "Deep Learning", icon: Brain },
    { name: "Natural Language Processing (NLP)", icon: MessageCircle },
    { name: "Computer Vision", icon: Image },
    { name: "Time Series Analysis", icon: Clock },
    { name: "Reinforcement Learning", icon: Repeat },
    { name: "Optimization Problems", icon: TrendingUp },
    { name: "Big Data & Distributed Computing", icon: Server },
    { name: "Tools & Libraries", icon: Package },
    { name: "Applications", icon: Grid },
    { name: "Mathematics & Statistics", icon: Sigma },
    { name: "Data Engineering", icon: HardDrive },
    { name: "Ethics & Fairness in AI", icon: Shield },
    { name: "Specialized Domains", icon: Briefcase }
  ];
  

  // Updated difficulties with icon-based badges
  const difficulties = [
    { name: "All", variant: "secondary" },
    { name: "Easy", variant: "success" },
    { name: "Medium", variant: "warning" },
    { name: "Hard", variant: "destructive" }
  ]

  const categories = ["All", "Arrays", "Strings", "Linked Lists"]

  const completionStates = [
    { value: "all", label: "All Problems", icon: List },
    { value: "completed", label: "Completed", icon: CheckCircle },
    { value: "pending", label: "Not Completed", icon: Clock }
  ]

  useEffect(() => {
    const fetchProblems = async () => {
      const accessToken = Cookies.get("access_token")
      if (!accessToken) {
        toast({
          title: "Authentication Error",
          description: "No access token found",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/problems/list/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProblems(data.problems)
        } else {
          toast({
            title: "Fetch Error",
            description: "Error loading problems",
            variant: "destructive"
          })
        }
      } catch (error) {
        toast({
          title: "Network Error",
          description: "Could not connect to server",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    const fetchTopUsers = async () => {
      const accessToken = Cookies.get("access_token")
      try {
        const response = await fetch("http://127.0.0.1:8000/users/ranking/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setTopUsers(data.users)
        }
      } catch (error) {
        console.error("Error fetching ranking:", error)
      }
    }

    fetchProblems()
    fetchTopUsers()
  }, [])

  useEffect(() => {
    const calculateProgress = () => {
      const stats = {
        total: { completed: 0, total: 0 },
        easy: { completed: 0, total: 0 },
        medium: { completed: 0, total: 0 },
        hard: { completed: 0, total: 0 }
      };

      problems.forEach(problem => {
        const difficulty = problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
        if (stats[difficulty]) {
          stats[difficulty].total++;
          if (problem.completed) stats[difficulty].completed++;
          stats.total.total++;
          if (problem.completed) stats.total.completed++;
        }
      });

      setProgressStats(stats);
    };

    if (problems.length > 0) {
      calculateProgress();
    }
  }, [problems]);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty =
      selectedDifficulty === "All" || problem.difficulty === selectedDifficulty
    const matchesCategory =
      selectedCategory === "All" || problem.category === selectedCategory
    const matchesCompletion =
      completionFilter === "all" ||
      (completionFilter === "completed" && problem.completed) ||
      (completionFilter === "pending" && !problem.completed)
    return matchesSearch && matchesDifficulty && matchesCategory && matchesCompletion
  })

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": 
        return "success"      // Verde
      case "medium": 
        return "warning"      // Amarillo
      case "hard": 
        return "destructive"  // Rojo
      default: 
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-[200px] w-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section with Animation */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient bg-300% transition-colors">
            Programming Problems
          </h1>
          <p className="text-muted-foreground">
            Explore, solve, and master programming challenges across different categories and difficulty levels
          </p>
          <Separator />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8">
          {/* Filters Panel */}
          <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
            <ScrollArea className="h-full">
              <div className="space-y-6 p-4 bg-card rounded-xl border shadow-sm">
                {/* Search Bar */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search problems..." 
                      className="pl-9 bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Difficulty Tabs */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Difficulty</Label>
                  <Tabs 
                    value={selectedDifficulty} 
                    onValueChange={setSelectedDifficulty} 
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4 h-9">
                      {difficulties.map((diff) => (
                        <TabsTrigger 
                          key={diff.name} 
                          value={diff.name}
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          {diff.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <Separator />

                {/* Status Radio Group */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <RadioGroup
                    value={completionFilter}
                    onValueChange={setCompletionFilter}
                    className="flex flex-col space-y-2"
                  >
                    {completionStates.map((state) => (
                      <div key={state.value} 
                          className="flex items-center space-x-2 rounded-lg hover:bg-accent p-2 transition-colors">
                        <RadioGroupItem value={state.value} id={state.value} />
                        <Label htmlFor={state.value} className="flex items-center flex-1 cursor-pointer">
                          <state.icon className="mr-2 h-4 w-4 text-primary" />
                          {state.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                {/* Category Grid */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categoriesWithIcons.map((category) => (
                      <Button
                        key={category.name}
                        variant={selectedCategory === category.name ? "default" : "outline"}
                        className={cn(
                          "flex items-center justify-start gap-2 h-auto py-2 px-3 transition-all",
                          selectedCategory === category.name && "bg-primary text-primary-foreground",
                          "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <category.icon className="h-4 w-4" />
                        <span className="text-sm truncate">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

              </div>
            </ScrollArea>
          </div>

          {/* Problems Grid */}
          <div className="space-y-6">
            {filteredProblems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-card rounded-xl border">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No problems found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProblems.map((problem) => (
                  <Card 
                    key={problem.id} 
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    onClick={() => window.location.href = `/problem/${problem.id}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl flex items-center">
                        {/* Add category icon to the problem title */}
                        {categoriesWithIcons.find(cat => cat.name === problem.category)?.icon && (
                          React.createElement(
                            categoriesWithIcons.find(cat => cat.name === problem.category)!.icon, 
                            { className: "mr-2 text-muted-foreground size-5" }
                          )
                        )}
                        {problem.title}
                      </CardTitle>
                      {problem.completed && <CheckCircle className="text-green-500" />}
                    </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {problem.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="text-purple-500 size-4" />
                          <span>{problem.timeLimit} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Trophy className="text-yellow-500 size-4" />
                          <span>{problem.points} pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge variant={getDifficultyVariant(problem.difficulty)}>
                        <Star className="mr-1 size-4" /> {problem.difficulty}
                      </Badge>
                      
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => window.location.href = `/problem/${problem.id}`}
                      >
                        Solve Problem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Ranking Panel */}
        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-4 bg-card rounded-xl border shadow-sm">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Top 10 Users
                </h3>
                <Separator />
                <div className="space-y-4">
                  {topUsers.slice(0, 10).map((user, index) => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${
                          index === 0 ? "text-yellow-500" :
                          index === 1 ? "text-gray-400" :
                          index === 2 ? "text-amber-600" :
                          "text-muted-foreground"
                        }`}>
                          #{index + 1}
                        </span>
                        <span>{user.username}</span>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {user.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-lg flex items-center mb-4">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Progress Tracker
                </h3>
                <Separator className="mb-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Círculo de fondo */}
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        {/* Círculo de progreso */}
                        <circle
                          className="text-primary stroke-current"
                          strokeWidth="10"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          style={{
                            strokeDasharray: `${2 * Math.PI * 40}`,
                            strokeDashoffset: `${2 * Math.PI * 40 * (1 - progressStats.total.completed / progressStats.total.total)}`,
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%'
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-2xl font-bold">
                            {Math.round((progressStats.total.completed / progressStats.total.total) * 100)}%
                          </span>
                          <p className="text-xs text-muted-foreground">Completado</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Easy</span>
                      <span className="font-medium text-green-500">
                        {progressStats.easy.completed}/{progressStats.easy.total}
                      </span>
                    </div>
                    <Progress 
                      value={(progressStats.easy.completed / progressStats.easy.total) * 100 || 0} 
                      className="h-2 bg-green-100" 
                    />
                  </div>
          
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Medium</span>
                      <span className="font-medium text-yellow-500">
                        {progressStats.medium.completed}/{progressStats.medium.total}
                      </span>
                    </div>
                    <Progress 
                      value={(progressStats.medium.completed / progressStats.medium.total) * 100 || 0} 
                      className="h-2 bg-yellow-100" 
                    />
                  </div>
          
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hard</span>
                      <span className="font-medium text-red-500">
                        {progressStats.hard.completed}/{progressStats.hard.total}
                      </span>
                    </div>
                    <Progress 
                      value={(progressStats.hard.completed / progressStats.hard.total) * 100 || 0} 
                      className="h-2 bg-red-100 bg-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
      <Toaster />
      <Footer />
    </div>
  )
}


export default ProblemsList