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
import ProblemCard from "./ProblemCard"
import FiltersPanel from "./FiltersPanel"
import RankingPanel from "./RankingPanel";

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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section Skeleton */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-10 w-2/3 rounded" />
          <Skeleton className="h-6 w-1/2 rounded" />
        </div>

        {/* Skeleton Grid for Problems */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 bg-card rounded-lg shadow">
              <Skeleton className="h-6 w-3/4 rounded mb-4" /> {/* Problem Title */}
              <Skeleton className="h-4 w-full rounded mb-2" /> {/* Description */}
              <Skeleton className="h-4 w-2/3 rounded mb-6" /> {/* Second line */}
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-1/4 rounded" /> {/* Time */}
                <Skeleton className="h-6 w-1/4 rounded" /> {/* Points */}
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-1/3 rounded" /> {/* Badge */}
                <Skeleton className="h-8 w-1/4 rounded" /> {/* Button */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
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
          <FiltersPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            completionFilter={completionFilter}
            setCompletionFilter={setCompletionFilter}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            difficulties={difficulties}
            completionStates={completionStates}
            categoriesWithIcons={categoriesWithIcons}
          />

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
                  <ProblemCard key={problem.id} problem={problem} />
                  ))}
                  </div>
          )}
        </div>

          {/* Ranking Panel */}
          <RankingPanel topUsers={topUsers} progressStats={progressStats} />
        
      </div>
    </div>
      <Toaster />
      <Footer />
    </div>
  )
}


export default ProblemsList