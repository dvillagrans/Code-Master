"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

interface TestResult {
  status: string;
  expected: string;
  output: string;
  execution_time: number;
  peak_memory: number;
}

interface TestCaseRotateProps {
  testCases: TestResult[];
  duration?: number;
  framerProps?: HTMLMotionProps<"div">;
  className?: string;
  children?: React.ReactNode; // Añadir propiedad children
  onTestComplete?: () => void;
}

export default function TestCaseRotate({
  testCases,
  duration = 2000, // Aumentar a 2 segundos (2000ms)
  framerProps = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { 
      duration: 0.5, // Aumentar duración de la transición
      ease: "easeInOut" // Cambiar el tipo de ease para una animación más suave
    },
  },
  className,
  children, // Añadir children a los props
  onTestComplete,
}: TestCaseRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testCases.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % testCases.length;
        if (onTestComplete && newIndex > prevIndex) {
          onTestComplete();
        }
        return newIndex;
      });
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [testCases, duration, onTestComplete]);

  if (testCases.length === 0) return null;

  const currentTestCase = testCases[index];

  return (
    <div className={cn("overflow-hidden py-2", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`test-case-${index}`}
          {...framerProps}
          className="w-full"
        >
          {children || ( // Usar children si existe, o el contenido por defecto
            <div className="text-center">
              <p className="font-bold">Test Case {index + 1}:</p>
              <p>Status: {currentTestCase.status}</p>
              <p>Expected: {currentTestCase.expected}</p>
              <p>Received: {currentTestCase.output}</p>
              <p>Execution Time: {currentTestCase.execution_time} s</p>
              <p>Memory Used: {currentTestCase.peak_memory} MB</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}