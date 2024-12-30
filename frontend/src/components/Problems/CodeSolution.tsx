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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import ResultsModal from "./ResultsModal";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Brain, Trophy } from "lucide-react";
import  ExampleCard  from "./ExampleCard";
import CodeEditor from "./CodeEditor";

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
  error_message?: string;
  input?: string;
}
interface SolutionState {
  status: string | null;
  output: string | testResult[] | null;
}

interface ProblemShowcaseProps {
  id: string;
}

interface Submission {
  id: number;
  status: string;
  language: string;
  execution_time: number;
  memory_usage: number;
  submitted_at: string;
}

// Nuevo componente para el indicador de estado
const StatusIndicator = ({ status }: { status: string }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={cn(
      "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2",
      status === "Accepted" && "bg-green-500/10 text-green-500",
      status === "Wrong Answer" && "bg-red-500/10 text-red-500",
      status === "Running" && "bg-blue-500/10 text-blue-500"
    )}
  >
    {status === "Accepted" && <Sparkles className="h-4 w-4" />}
    {status === "Wrong Answer" && <XCircle className="h-4 w-4" />}
    {status === "Running" && (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Activity className="h-4 w-4" />
      </motion.div>
    )}
    {status}
  </motion.div>
);


// Mejorar el botón de envío
const SubmitButton = ({ onClick, loading }: { onClick: () => void; loading: boolean }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Button
      onClick={onClick}
      disabled={loading}
      className="w-full relative overflow-hidden group"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity"
        animate={loading ? {
          x: ["0%", "100%"],
          opacity: [0, 1, 0],
        } : {}}
        transition={{
          duration: 1,
          repeat: loading ? Infinity : 0,
          ease: "easeInOut",
        }}
      />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Ejecutando...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Enviar Solución
          </>
        )}
      </span>
    </Button>
  </motion.div>
);

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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  
  useEffect(() => {
    fetchProblem();
    fetchSubmissions();
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

  const fetchSubmissions = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) return;

    try {
      setSubmissions([]); // Reset submissions
      const response = await fetch(`http://127.0.0.1:8000/solutions/problems/${id}/submissions/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Submissions received:", data); // Para debug
        setSubmissions(data);
      } else {
        console.error("Error fetching submissions:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleWebSocket = (solutionId: number) => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Authorization token not found.");
      return;
    }

    wsRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/solutions/${solutionId}/`);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
      toast.success("Connected to solution status");
    };

    wsRef.current.onmessage = (event) => {
      try {
        console.log("Received message:", event.data);
        const message = JSON.parse(event.data);
        
        if (message.status === "Running") {
          const testCaseInfo = message.message.match(/Test case (\d+)\/(\d+): (.+)/);
          if (testCaseInfo) {
            const testCaseNumber = parseInt(testCaseInfo[1]);
            const totalCases = parseInt(testCaseInfo[2]);
            const result = testCaseInfo[3];
            
            totalTestsRef.current = totalCases;
            
            // Crear un nuevo array de resultados si no existe
            setSolution(prev => {
              const newOutput = Array.isArray(prev.output) ? [...prev.output] : Array(totalCases).fill(null);
              
              newOutput[testCaseNumber - 1] = {
                status: result.includes("Passed") ? "Passed" : "Failed",
                expected: message.expected || "N/A",
                output: message.output || "N/A",
                execution_time: message.execution_time || 0,
                peak_memory: message.peak_memory || 0,
                error_message: message.error_message || "",
                input: message.input || "N/A"
              };

              return {
                status: "Running",
                output: newOutput
              };
            });

            setCurrentTestCaseIndex(testCaseNumber - 1);
            setIsTestCaseRotating(true);
            setShowResultsModal(true); // Mantener el modal abierto durante la ejecución
          }
        } else if (message.status === "Completed") {
          const isAllAccepted = message.message.includes("Solution Accepted");
          
          if (isAllAccepted) {
            setShowConfetti(true);
            fireSideConfetti();
          }
          
          // Asegurar que el modal permanezca abierto
          setShowResultsModal(true);
          setIsTestCaseRotating(false);
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
          setShowResultsModal(true);
          setShowConfetti(false);
        }, 3000);
      } else {
        setShowResultsModal(true);
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

if (loading) return (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/5" />
      </div>

      <Separator />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
        {/* Problem Description Card */}
        <Card className="lg:sticky lg:top-4 h-fit">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/5" />
          </CardContent>
        </Card>

        {/* Code Editor Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-40 w-full bg-muted" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

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
                Información del Problema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="description" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Descripción</TabsTrigger>
                  <TabsTrigger value="submissions">Envíos</TabsTrigger>
                  <TabsTrigger value="discussions">Discusiones</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{problem.description}</p>
                  </div>

                  {problem.formula && (
                    <div className="p-4 rounded-lg bg-muted">
                    </div>
                  )}

                  {problem.examples && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Ejemplos</h3>
                      <Carousel>
                        <CarouselContent>
                          {problem.examples.map((example, index) => (
                            <ExampleCard key={index} example={example} index={index} />
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="submissions">
                  <ScrollArea className="h-[400px]">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Estado</TableHead>
                            <TableHead className="w-[100px]">Lenguaje</TableHead>
                            <TableHead className="w-[100px] text-right">Tiempo</TableHead>
                            <TableHead className="w-[100px] text-right">Memoria</TableHead>
                            <TableHead className="w-[150px]">Enviado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submissions === null ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6">
                                <div className="flex items-center justify-center">
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                                  Cargando envíos...
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : submissions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                                No hay envíos para mostrar
                              </TableCell>
                            </TableRow>
                          ) : (
                            submissions.map((submission) => (
                              <TableRow key={submission.id}>
                                <TableCell>
                                  <Badge 
                                    variant={submission.status === "Accepted" ? "default" : "destructive"}
                                    className="whitespace-nowrap"
                                  >
                                    {submission.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {submission.language}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {submission.execution_time.toFixed(2)}ms
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {submission.memory_usage.toFixed(2)}MB
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-muted-foreground">
                                  {formatDistanceToNow(new Date(submission.submitted_at), {
                                    addSuffix: true,
                                    locale: es
                                  })}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="discussions">
                  <div className="text-center text-muted-foreground py-8">
                    Las discusiones estarán disponibles próximamente.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Code Editor Card */}
          <div className="space-y-6">
          <CardContent className="space-y-4">
  <CodeEditor value={code} onChange={setCode} />
  <div className="flex gap-2">
    <SubmitButton onClick={handleSubmit} loading={submitting} />
    <Button 
      variant="outline" 
      onClick={handleReset}
      className="w-32"
    >
      Resetear
    </Button>
  </div>
</CardContent>

            {/* Results Card */}
            {solution.output && (
              <ResultsModal
                isOpen={showResultsModal}
                onClose={() => setShowResultsModal(false)}
                results={Array.isArray(solution.output) ? solution.output : []}
                isRotating={isTestCaseRotating}
                currentIndex={currentTestCaseIndex}
                totalTests={totalTestsRef.current}
                completedTests={completedTests}
                onTestComplete={() => setCompletedTests(prev => prev + 1)}
              />
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