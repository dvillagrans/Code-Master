import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import Header from "./Header";
import { useTheme } from "@/context/ThemeContext";

const ProblemShowcase = () => {
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState("");

  const handleReset = () => {
    setCode("");
  };

  const handleSubmit = () => {
    if (code.trim() === "") {
      toast.error("Please enter your code solution");
      return;
    }
    toast.success("Solution submitted successfully");
  };

  const dummyProblem = {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation:
          "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109",
      "Only one valid answer exists.",
    ],
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex space-x-10">
          {/* Problem Description */}
          <div className="flex-1">
            <h1 className={`text-4xl font-bold text-transparent bg-clip-text ${isDarkMode 
              ? 'bg-gradient-to-r from-indigo-300 to-purple-400' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
              {dummyProblem.title}
            </h1>
            <div className={`rounded-xl shadow-xl p-8 border ${isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-slate-200'}`}>
              <h2 className="text-2xl font-semibold mb-6">Problem Description</h2>
              <p className="leading-relaxed text-lg">{dummyProblem.description}</p>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Example:</h3>
                {dummyProblem.examples.map((example, index) => (
                  <div 
                    key={index} 
                    className={`p-6 rounded-lg border ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-slate-200'}`}
                  >
                    <p className="font-mono text-base">Input: {example.input}</p>
                    <p className="font-mono text-base">Output: {example.output}</p>
                    <p className="text-base mt-3">Explanation: {example.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Constraints:</h3>
                <ul className="list-disc list-inside space-y-2">
                  {dummyProblem.constraints.map((constraint, index) => (
                    <li 
                      key={index} 
                      className={`font-mono text-base ${isDarkMode 
                        ? 'text-gray-300' 
                        : 'text-gray-700'}`}
                    >
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Code Editor Section */}
          <div className="flex-1">
            <h2 className={`text-2xl font-semibold mb-8 mt-[4.5rem] ${isDarkMode 
              ? 'text-gray-200' 
              : 'text-gray-800'}`}>
              Write your solution
            </h2>
            <div className={`rounded-xl shadow-xl p-8 border ${isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-slate-200'}`}>
              <div className={`h-[400px] border rounded-lg overflow-hidden ${isDarkMode 
                ? 'border-gray-600' 
                : 'border-purple-200'}`}>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`w-full h-full p-6 font-mono text-base focus:outline-none ${isDarkMode 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-gradient-to-br from-gray-50 to-white'}`}
                  placeholder="Write your code here..."
                />
              </div>
              <div className="flex space-x-6 mt-6">
                <button
                  onClick={handleSubmit}
                  className={`px-8 py-3 rounded-lg focus:outline-none transition-all duration-300 font-medium text-lg shadow-md hover:shadow-xl ${isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'}`}
                >
                  Submit Solution
                </button>
                <button
                  onClick={handleReset}
                  className={`px-8 py-3 rounded-lg focus:outline-none transition-all duration-300 font-medium text-lg shadow-md hover:shadow-xl ${isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:opacity-90'}`}
                >
                  Reset Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default ProblemShowcase;