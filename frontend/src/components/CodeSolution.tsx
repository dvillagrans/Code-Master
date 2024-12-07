import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Footer from "./Footer";
import Cookies from "js-cookie";
import Header from "./Header";

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string | null;
  tags: string[];
  constraints?: string[];
  examples?: { input: string; output: string; explanation: string }[];
}

interface ProblemShowcaseProps {
  id: string;
}

const ProblemShowcase: React.FC<ProblemShowcaseProps> = ({ id }) => {
  const { isDarkMode } = useTheme();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");

  // Fetch problem by ID
  useEffect(() => {
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
          console.error("Error fetching problem:", response.statusText);
          toast.error("Error fetching problem details");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        toast.error("An error occurred while fetching problem details");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleReset = () => {
    setCode("");
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked"); // Log para verificar el clic
  
    if (code.trim() === "") {
      console.log("Code is empty"); // Log para verificar el estado del código
      toast.error("Please enter your code solution");
      return;
    }
  
    // Actualiza a la versión basada en navegador
    const toBase64Unicode = (str: string) => btoa(unescape(encodeURIComponent(str)));
    const encodedCode = toBase64Unicode(code);
  
    const payload = {
      problem_id: parseInt(id), // Convertir ID a número
      language: "python", // Lenguaje hardcoded por ahora
      code: encodedCode, // Código en Base64
    };
  
    console.log("Payload:", payload); // Log para verificar el payload
  
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        toast.error("Authorization token not found.");
        return;
      }
  
      console.log("Access Token:", accessToken); // Log para verificar el token
  
      const response = await fetch("http://127.0.0.1:8000/solutions/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
  
      console.log("Response Status:", response.status); // Log para el estado de la respuesta
  
      if (response.ok) {
        const data = await response.json();
        toast.success("Solution submitted successfully!");
        console.log("Server response:", data);
      } else {
        const errorData = await response.json();
        console.error("Error submitting solution:", errorData);
        toast.error(`Failed to submit solution: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading problem...</div>;
  }

  if (!problem) {
    return <div className="min-h-screen flex items-center justify-center">Problem not found</div>;
  }

  return (
    <div>
      <Header />
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-foreground">{problem.title}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Problem Description */}
        <Card>
          <CardHeader>
            <CardTitle>Problem Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{problem.description}</p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Example</h3>
              {problem.examples && problem.examples.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <p className="font-mono">Input: {problem.examples[0].input}</p>
                    <p className="font-mono">Output: {problem.examples[0].output}</p>
                    <p className="text-muted-foreground mt-2">
                      {problem.examples[0].explanation}
                    </p>
                  </CardContent>
                </Card>
              )}

              <h3 className="text-lg font-semibold">Constraints</h3>
              <div className="space-y-2">
                {problem.constraints && problem.constraints.map((constraint, index) => (
                  <Badge key={index} variant="secondary">
                    {constraint}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Editor */}
        
          {/* Code Editor */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>Write Your Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your code here..."
                  className="min-h-[400px] font-mono"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div className="flex space-x-4 mt-6">
                  <Button onClick={handleSubmit}>Submit Solution</Button>
                  <Button variant="secondary" onClick={handleReset}>
                    Reset Code
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
      <Toaster />
    </div>
    <Footer />
</div>
  );
};

export default ProblemShowcase