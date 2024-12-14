import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, CheckCircle } from "lucide-react";

interface User {
  username: string;
  points: number;
}

interface ProgressStats {
  total: { completed: number; total: number };
  easy: { completed: number; total: number };
  medium: { completed: number; total: number };
  hard: { completed: number; total: number };
}

interface RankingPanelProps {
  topUsers: User[];
  progressStats: ProgressStats;
}

const RankingPanel: React.FC<RankingPanelProps> = ({ topUsers, progressStats }) => {
  return (
    <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
      <ScrollArea className="h-full">
        <div className="space-y-6 p-4 bg-card rounded-xl border shadow-sm">
          {/* Top Users */}
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
                    <span
                      className={`font-bold ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-gray-400"
                          : index === 2
                          ? "text-amber-600"
                          : "text-muted-foreground"
                      }`}
                    >
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

          {/* Progress Tracker */}
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
                    {/* Background Circle */}
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    {/* Progress Circle */}
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
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
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

              {/* Progress Bars */}
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
  );
};

export default RankingPanel;
