import React, { useState, useEffect, useRef} from "react";
import { Toaster, toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Code } from "@/components/ui/code-comparison";
import { Code as LucideCode } from "lucide-react";
import FormulaComponent from "@/components/ui/FormulaComponent";
import { Confetti, fireSideConfetti } from "@/components/ui/confetti";
import WordRotate from "@/components/ui/word-rotate";
import Cookies from "js-cookie";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CheckCircle, Activity, XCircle } from "react-feather";
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string | null;
  tags: string[];
  examples?: { input: string; output: string; explanation: string }[];
  formula: string;
  completed?: boolean;
}
interface testResult {
  status: string;
  expected: string;
  output: string;
  execution_time: number;
  peak_memory: number;
}
interface SolutionState {
  status: string | null;
  output: string | testResult[] | null;
}

interface ProblemShowcaseProps {
  id: string;
}

const ProblemShowcase: React.FC<ProblemShowcaseProps> = ({ id }) => {
  const { isDarkMode } = useTheme();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const [solution, setSolution] = useState<SolutionState>({ status: null, output: null });
  const wsRef = useRef<WebSocket | null>(null);
  const [isTestCaseRotating, setIsTestCaseRotating] = useState(false);
  const [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [completedTests, setCompletedTests] = useState(0);
  const totalTestsRef = useRef(0);
  
  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    setLoading(true);
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      toast.error("No access token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/problems/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProblem(data);
      } else {
        toast.error("Error fetching problem details");
      }
    } catch (error) {
      console.error("Error fetching problem:", error);
      toast.error("An error occurred while fetching problem details");
    } finally {
      setLoading(false);
    }
  };

  const handleWebSocket = (solutionId: number) => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Authorization token not found.");
      return;
    }

    wsRef.current = new WebSocket(`ws://127.0.0.1:9000/ws/solutions/${solutionId}/`);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
      toast.success("Connected to solution status");
    };

    wsRef.current.onmessage = (event) => {
      try {
        console.log("Received message:", event.data);
        const message = JSON.parse(event.data);
        
        if (message.status === "Running") {
          const testCaseInfo = message.message.match(/Test case (\d+)\/\d+: (.+)/);
          if (testCaseInfo) {
            setShowFinalResults(false);
            setShowConfetti(false); // Reset confetti state
            const testCaseNumber = parseInt(testCaseInfo[1]);
            const totalCases = parseInt(testCaseInfo[0].split('/')[1]);
            totalTestsRef.current = totalCases; // Guardar el total de tests
            
            const result = testCaseInfo[2];
            
            const testResult = {
              status: result.includes("Passed") ? "Passed" : "Failed",
              expected: "N/A",
              output: "N/A",
              execution_time: 0,
              peak_memory: 0
            };

            setSolution(prev => ({
              status: message.status,
              output: Array.isArray(prev.output) 
                ? [
                    ...prev.output.slice(0, testCaseNumber - 1),
                    testResult,
                    ...prev.output.slice(testCaseNumber)
                  ]
                : Array(totalCases).fill(null).map((_, i) => 
                    i === testCaseNumber - 1 ? testResult : {
                      status: "Pending",
                      expected: "N/A",
                      output: "N/A",
                      execution_time: 0,
                      peak_memory: 0
                    }
                  )
            }));

            setIsTestCaseRotating(true);
            setCurrentTestCaseIndex(testCaseNumber - 1);
          }
        } else if (message.status === "Completed") {
          const isAllAccepted = message.message.includes("Solution Accepted");
          
          // Primero completamos la rotación
          if (solution.output && Array.isArray(solution.output)) {
            setCompletedTests(0); // Reset contador
            setIsTestCaseRotating(true);
            
            // Usar el WordRotate para mostrar los resultados
            // El completedTests se incrementará cuando cada test termine de mostrarse
          }
        }

      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Connection error occurred");
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      wsRef.current = null;
    };
  };

  // Efecto para manejar la finalización de las rotaciones
  useEffect(() => {
    if (completedTests === totalTestsRef.current && totalTestsRef.current > 0) {
      setIsTestCaseRotating(false);
      const isAllPassed = solution.output && Array.isArray(solution.output) && 
        solution.output.every(test => test.status === "Passed");
      
      if (isAllPassed) {
        setShowConfetti(true);
        fireSideConfetti();
        setTimeout(() => {
          setShowFinalResults(true);
          setShowConfetti(false);
        }, 3000);
      } else {
        setShowFinalResults(true);
      }
    }
  }, [completedTests, solution.output]);

  const handleSubmit = async () => {
    if (!problem) {
      toast.error("No problem selected.");
      return;
    }

    if (code.trim() === "") {
      toast.error("Please enter your code solution");
      return;
    }

    setSubmitting(true);
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        toast.error("Authorization token not found.");
        return;
      }

      const toBase64Unicode = (str: string) => btoa(unescape(encodeURIComponent(str)));
      const encodedCode = toBase64Unicode(code);

      const payload = {
        problem_id: problem.id,
        language: "python",
        code: encodedCode,
      };

      const response = await fetch("http://127.0.0.1:8000/solutions/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Solution submitted successfully!");
        // Inicia la conexión WebSocket y guarda la función de cleanup
        const cleanup = handleWebSocket(data.solution_id);
        // Opcional: guardar la función de cleanup en un ref si necesitas
        // limpiar la conexión más tarde
      } else {
        const errorData = await response.json();
        toast.error(`Failed to submit solution: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode("");
  };

  if (loading) return <div>Loading...</div>;

  if (!problem) {
    return <div>Error: Problem not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti className="w-full h-full" />
        </div>
      )}
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                {problem.title}
                {problem.completed && (
                  <CheckCircle className="inline-block ml-2 text-green-500" />
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge 
                  variant={problem.difficulty === "Hard" ? "destructive" : 
                          problem.difficulty === "Medium" ? "default" : "secondary"}
                  className="font-medium"
                >
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline">{problem.category}</Badge>
                {problem.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Separator />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          {/* Problem Description Card */}
          <Card className="lg:sticky lg:top-4 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideCode className="h-5 w-5 text-primary" />
                Descripción del Problema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <p>{problem.description}</p>
              </div>

              {problem.formula && (
                <div className="p-4 rounded-lg bg-muted">
                  <FormulaComponent formula={problem.formula} />
                </div>
              )}

              {problem.examples && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Ejemplos</h3>
                  <Carousel>
                    <CarouselContent>
                      {problem.examples.map((example, index) => (
                        <CarouselItem key={index}>
                          <Card>
                            <CardContent className="p-4 space-y-4">
                              <div className="space-y-2">
                                <Badge variant="outline">Ejemplo {index + 1}</Badge>
                                <div className="space-y-2">
                                  <Code className="w-full p-3">{`Input: ${example.input}`}</Code>
                                  <Code className="w-full p-3">{`Output: ${example.output}`}</Code>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <FormulaComponent formula={example.explanation} />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code Editor Card */}
          <div className="space-y-6">
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LucideCode className="h-5 w-5 text-primary" />
                    Tu Solución
                  </CardTitle>
                  <CardDescription>
                    Escribe tu código en Python para resolver el problema
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="# Escribe tu código aquí..."
                  className="font-mono min-h-[400px] resize-none bg-muted"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                        Ejecutando...
                      </>
                    ) : (
                      "Enviar Solución"
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="w-32"
                  >
                    Resetear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            {solution.output && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Resultados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isTestCaseRotating ? (
                    <div className="space-y-4">
                      <Progress 
                        value={(completedTests / totalTestsRef.current) * 100} 
                        className="h-2"
                      />
                      <div className="p-4 rounded-lg bg-muted animate-pulse">
                        <WordRotate 
                          testCases={Array.isArray(solution.output) ? solution.output : []}
                          onTestComplete={() => setCompletedTests(prev => prev + 1)}
                        >
                          <div className="text-center space-y-2">
                            <p className="font-semibold">
                              Test Case {currentTestCaseIndex + 1}/{totalTestsRef.current}
                            </p>
                            <Badge variant={
                              typeof solution.output[currentTestCaseIndex] === 'object' && solution.output[currentTestCaseIndex]?.status === "Passed" 
                                ? "default" 
                                : "destructive"
                            }>
                              {typeof solution.output[currentTestCaseIndex] === 'object' ? solution.output[currentTestCaseIndex]?.status : ''}
                            </Badge>
                          </div>
                        </WordRotate>
                      </div>
                    </div>
                  ) : showFinalResults && (
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {Array.isArray(solution.output) && solution.output.map((result: testResult, index: number) => (
                          <div
                            key={index}
                            className={cn(
                              "p-4 rounded-lg transition-colors",
                              result.status === "Passed" 
                                ? "bg-primary/10 border border-primary/20" 
                                : "bg-destructive/10 border border-destructive/20"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Test Case {index + 1}</span>
                              <Badge variant={result.status === "Passed" ? "default" : "destructive"}>
                                {result.status === "Passed" ? (
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                ) : (
                                  <XCircle className="mr-1 h-3 w-3" />
                                )}
                                {result.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default ProblemShowcase;