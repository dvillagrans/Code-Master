import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, CheckCircle, Star } from "lucide-react";

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  completed: boolean;
  timeLimit: string;
  points: number;
}

const ProblemCard: React.FC<{ problem: Problem }> = ({ problem }) => {
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={() => window.location.href = `/problem/${problem.id}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl flex items-center">
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
          <Button variant="secondary" size="sm">
            Solve Problem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemCard;
