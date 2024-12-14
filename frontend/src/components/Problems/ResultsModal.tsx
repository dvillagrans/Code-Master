import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "react-feather";
import { cn } from "@/lib/utils";
import WordRotate from "@/components/ui/word-rotate";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: any[];
  isRotating: boolean;
  currentIndex: number;
  totalTests: number;
  completedTests: number;
  onTestComplete: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  results,
  isRotating,
  currentIndex,
  totalTests,
  completedTests,
  onTestComplete,
}) => {
  const validResults = Array.isArray(results) ? results.filter(r => r !== null) : [];
  const isAllPassed = validResults.length > 0 && validResults.every((test) => test?.status === "Passed");

  // Agregar console.log para debugging
  console.log("ResultsModal props:", {
    isOpen,
    results: validResults,
    isRotating,
    currentIndex,
    totalTests,
    completedTests
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {isRotating ? (
              "Ejecutando Tests..."
            ) : (
              <>
                {isAllPassed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                {isAllPassed ? "¡Solución Aceptada!" : "Tests Fallidos"}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isRotating && validResults.length > 0 ? (
            <div className="space-y-4">
              <Progress
                value={(completedTests / totalTests) * 100}
                className="h-2"
              />
              <div className="p-6 rounded-lg bg-muted/50 backdrop-blur-sm">
                <WordRotate
                  testCases={validResults}
                  onTestComplete={onTestComplete}
                >
                  {currentIndex < validResults.length && (
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                          <div className="animate-bounce">
                            {validResults[currentIndex]?.status === "Passed" ? (
                              <CheckCircle className="h-8 w-8 text-green-500" />
                            ) : (
                              <XCircle className="h-8 w-8 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-lg">
                        Test Case {currentIndex + 1}/{totalTests}
                      </p>
                      <Badge
                        variant={
                          validResults[currentIndex]?.status === "Passed"
                            ? "default"
                            : "destructive"
                        }
                        className="text-sm px-4 py-1"
                      >
                        {validResults[currentIndex]?.status}
                      </Badge>
                    </div>
                  )}
                </WordRotate>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {validResults.map((result, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-6 rounded-lg transition-all",
                      result.status === "Passed"
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-destructive/10 border border-destructive/20"
                    )}
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.status === "Passed" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <h3 className="font-semibold text-lg">Test Case {index + 1}</h3>
                        </div>
                        <Badge
                          variant={result.status === "Passed" ? "default" : "destructive"}
                          className="px-3 py-1"
                        >
                          {result.status}
                        </Badge>
                      </div>

                      {/* Detalles del test case */}
                      <div className="grid gap-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="font-medium text-muted-foreground">Input:</p>
                            <pre className="p-2 rounded bg-muted/50 overflow-x-auto">
                              {result.input}
                            </pre>
                          </div>
                          <div className="space-y-2">
                            <p className="font-medium text-muted-foreground">Tu salida:</p>
                            <pre className="p-2 rounded bg-muted/50 overflow-x-auto">
                              {result.output}
                            </pre>
                          </div>
                        </div>
                        
                        {result.status === "Failed" && (
                          <div className="space-y-2">
                            <p className="font-medium text-muted-foreground">Salida esperada:</p>
                            <pre className="p-2 rounded bg-muted/50 overflow-x-auto">
                              {result.expected}
                            </pre>
                            {result.error_message && (
                              <div className="mt-2 p-2 rounded bg-destructive/10 text-destructive">
                                {result.error_message}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Métricas */}
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div>
                          Tiempo de ejecución: {result.execution_time.toFixed(2)}ms
                        </div>
                        <div>
                          Memoria utilizada: {result.peak_memory.toFixed(2)}MB
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;
