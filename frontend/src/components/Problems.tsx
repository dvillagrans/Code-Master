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
  Moon 
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "../hooks/use-toast"
import Header from "./Header"
import Footer from "./Footer"


const ProblemsList = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [problems, setProblems] = useState<Problem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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

  const categories = ["All", "Arrays", "Strings", "Linked Lists"]
  const difficulties = ["All", "Easy", "Medium", "Hard"]

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

    fetchProblems()
  }, [])

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty =
      selectedDifficulty === "All" || problem.difficulty === selectedDifficulty
    const matchesCategory =
      selectedCategory === "All" || problem.category === selectedCategory
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "secondary"
      case "Medium": return "default"
      case "Hard": return "destructive"
      default: return "secondary"
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
    <div>
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Programming Problems
          </h1>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search problems..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Select 
              value={selectedDifficulty} 
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff} value={diff}>
                    {diff} Difficulty
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No problems found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <Card 
                key={problem.id} 
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl">{problem.title}</CardTitle>
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
                        <span>{problem.timeLimit}</span>
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
      <Toaster />
    </div>
      <Footer />
</div>
  )
}

export default ProblemsList