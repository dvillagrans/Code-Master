import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BsHouseDoor, BsCode, BsPerson, BsPlus, BsTrash } from "react-icons/bs";
import { Editor } from "@/components/ui/editor";
import { Tags } from "@/components/ui/tags";
import FormulaComponent from "@/components/ui/FormulaComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Header from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
// Definir esquema de validación
const problemSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.string().min(1, "Debe seleccionar una categoría"),
  tags: z.array(z.string()),
  formula: z.string().optional(),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string()
  })).min(1, "Debe incluir al menos un ejemplo"),
  testCases: z.array(z.object({
    input: z.string(),
    expectedOutput: z.string(),
    visibility: z.enum(["public", "private"])
  })).min(1, "Debe incluir al menos un caso de prueba")
});

const ProblemUpload = () => {
  const form = useForm<z.infer<typeof problemSchema>>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy" as const,
      category: "",
      tags: [],
      formula: "",
      examples: [
        {
          input: "",
          output: "",
          explanation: ""
        }
      ],
      testCases: [
        {
          input: "",
          expectedOutput: "",
          visibility: "public" as const
        }
      ]
    }
  });

  // Manejar envío del formulario
  const onSubmit = async (data: z.infer<typeof problemSchema>) => {
    try {
      const response = await fetch("/api/problems/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success("Problema creado exitosamente");
      } else {
        throw new Error("Error al crear el problema");
      }
    } catch (error) {
      toast.error("Error al crear el problema");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="edit" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="edit" className="text-lg transition-all">Editar Problema</TabsTrigger>
              <TabsTrigger value="preview" className="text-lg transition-all">Vista Previa</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                      Información General
                    </h2>
                    
                    <div className="grid gap-8">
                      <Input
                        {...form.register("title")}
                        placeholder="Título del problema"
                        className="text-xl font-medium px-4 py-3 border-2 focus:ring-2 transition-all"
                      />

                      <div className="space-y-2">
                        <Editor
                          value={form.watch("description")}
                          onChange={(value) => form.setValue("description", value)}
                          placeholder="Descripción detallada del problema..."
                          className="min-h-[200px] border-2 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Dificultad</label>
                          <select
                            {...form.register("difficulty")}
                            className="w-full rounded-lg border-2 p-2 transition-colors hover:border-green-500"
                          >
                            <option value="easy">Fácil</option>
                            <option value="medium">Medio</option>
                            <option value="hard">Difícil</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <input
                            type="text"
                            {...form.register("category")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                      </div>

                      <Tags
                        value={form.watch("tags")}
                        onChange={(tags) => form.setValue("tags", tags)}
                        suggestions={["arrays", "strings", "dp", "math"]}
                      />

                      <div className="space-y-2">
                        <Input
                          {...form.register("formula")}
                          placeholder="Fórmula matemática (LaTeX)"
                        />
                        {form.watch("formula") && (
                          <div className="p-4 bg-muted rounded-lg">
                            <FormulaComponent formula={form.watch("formula") ?? ""} />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ejemplos y Casos de prueba con estilos mejorados */}
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Ejemplos</h2>
                      <Button
                        type="button"
                        onClick={() => form.setValue("examples", [...form.watch("examples"), { input: "", output: "", explanation: "" }])}
                        className="flex items-center space-x-2 bg-green-50 text-green-600 hover:bg-green-100 transition-colors rounded-lg px-4 py-2"
                      >
                        <BsPlus size={24} />
                        <span>Agregar Ejemplo</span>
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* Ejemplos con estilos mejorados */}
                      {form.watch("examples").map((example, index) => (
                        <div key={index} className="p-6 bg-muted/50 rounded-xl border-2 transition-all hover:border-green-500">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => form.setValue("examples", form.watch("examples").filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <BsTrash />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Input</label>
                              <textarea
                                value={example.input}
                                onChange={(e) => {
                                  const newExamples = [...form.watch("examples")];
                                  newExamples[index].input = e.target.value;
                                  form.setValue("examples", newExamples);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Output</label>
                              <textarea
                                value={example.output}
                                onChange={(e) => {
                                  const newExamples = [...form.watch("examples")];
                                  newExamples[index].output = e.target.value;
                                  form.setValue("examples", newExamples);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Explanation</label>
                            <textarea
                              value={example.explanation}
                              onChange={(e) => {
                                const newExamples = [...form.watch("examples")];
                                newExamples[index].explanation = e.target.value;
                                form.setValue("examples", newExamples);
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Test Cases</h2>
                      <button
                        type="button"
                        onClick={() => form.setValue("testCases", [...form.watch("testCases"), { input: "", expectedOutput: "", visibility: "public" }])}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                      >
                        <BsPlus size={20} />
                        <span>Add Test Case</span>
                      </button>
                    </div>

                    {form.watch("testCases").map((testCase, index) => (
                      <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-md">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => form.setValue("testCases", form.watch("testCases").filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <BsTrash />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Input</label>
                            <textarea
                              value={testCase.input}
                              onChange={(e) => {
                                const newTestCases = [...form.watch("testCases")];
                                newTestCases[index].input = e.target.value;
                                form.setValue("testCases", newTestCases);
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Expected Output</label>
                            <textarea
                              value={testCase.expectedOutput}
                              onChange={(e) => {
                                const newTestCases = [...form.watch("testCases")];
                                newTestCases[index].expectedOutput = e.target.value;
                                form.setValue("testCases", newTestCases);
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Visibility</label>
                          <select
                            value={testCase.visibility}
                            onChange={(e) => {
                              const newTestCases = [...form.watch("testCases")];
                              newTestCases[index].visibility = e.target.value as "public" | "private";
                              form.setValue("testCases", newTestCases);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => form.reset()}
                    className="px-6 py-2 transition-all hover:bg-destructive/10"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white transition-all"
                  >
                    Crear Problema
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="preview">
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-8">
                  <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                      {form.watch("title")}
                    </h1>
                    <div dangerouslySetInnerHTML={{ __html: form.watch("description") }} />
                    
                    {form.watch("formula") && (
                      <div className="my-4">
                        <FormulaComponent formula={form.watch("formula") ?? ""} />
                      </div>
                    )}

                    {/* Preview de ejemplos */}
                    <h2>Ejemplos</h2>
                    {form.watch("examples").map((example, index) => (
                      <div key={index} className="my-4 p-4 bg-muted rounded-lg">
                        <div>
                          <strong>Input:</strong> {example.input}
                        </div>
                        <div>
                          <strong>Output:</strong> {example.output}
                        </div>
                        <div>
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProblemUpload;
