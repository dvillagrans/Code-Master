import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaStar, FaCheckCircle, FaClock, FaCode, FaTrophy, FaSun, FaMoon } from "react-icons/fa";
import Header from "@/components/Header";

const mockProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    completed: true,
    timeLimit: "15 mins",
    points: 100,
    category: "Arrays"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: "Add two numbers represented by linked lists. The digits are stored in reverse order.",
    completed: false,
    timeLimit: "30 mins",
    points: 200,
    category: "Linked Lists"
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description: "Find the median of two sorted arrays with logarithmic complexity.",
    completed: false,
    timeLimit: "45 mins",
    points: 300,
    category: "Arrays"
  },
  {
    id: 4,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    completed: true,
    timeLimit: "20 mins",
    points: 150,
    category: "Strings"
  },
  {
    id: 5,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    description: "Merge k sorted linked lists and return it as one sorted list.",
    completed: false,
    timeLimit: "50 mins",
    points: 400,
    category: "Linked Lists"
  }
];

const ProblemsList = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [problems, setProblems] = useState(mockProblems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [animateCards, setAnimateCards] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Add theme class to body
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    setAnimateCards(true);
    const timer = setTimeout(() => setAnimateCards(false), 500);
    return () => clearTimeout(timer);
  }, [selectedDifficulty, selectedCategory]);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === "All" || problem.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    // Different color scheme for light and dark modes
    if (theme === 'light') {
      switch (difficulty) {
        case "Easy": return "bg-gradient-to-r from-green-200 to-green-300";
        case "Medium": return "bg-gradient-to-r from-yellow-200 to-yellow-300";
        case "Hard": return "bg-gradient-to-r from-red-200 to-red-300";
        default: return "bg-gradient-to-r from-gray-200 to-gray-300";
      }
    } else {
      switch (difficulty) {
        case "Easy": return "bg-gradient-to-r from-emerald-400 to-green-500";
        case "Medium": return "bg-gradient-to-r from-amber-400 to-yellow-500";
        case "Hard": return "bg-gradient-to-r from-rose-400 to-red-500";
        default: return "bg-gradient-to-r from-gray-400 to-gray-500";
      }
    }
  };

  const categories = ["All", "Arrays", "Strings", "Linked Lists"];

  return (
    <div className={`min-h-screen ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900' 
        : 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
    }`}>
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme} 
        className={`fixed top-4 right-4 z-50 p-2 rounded-full ${
          theme === 'light'
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        } transition-colors duration-300`}
      >
        {theme === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      {/* Header */}
      <Header />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl font-bold text-transparent bg-clip-text ${
            theme === 'light' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
              : 'bg-gradient-to-r from-blue-400 to-purple-500'
          } mb-8`}>
            Programming Problems
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search problems..."
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  theme === 'light'
                    ? 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                    : 'bg-gray-800 border border-gray-700 text-white placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className={theme === 'light' ? 'absolute left-3 top-4 text-gray-500' : 'absolute left-3 top-4 text-gray-400'} />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select
                  className={`pl-10 pr-4 py-3 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white border border-gray-300 text-gray-900'
                      : 'bg-gray-800 border border-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none`}
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <FaFilter className={theme === 'light' ? 'absolute left-3 top-4 text-gray-500' : 'absolute left-3 top-4 text-gray-400'} />
              </div>

              <div className="relative">
                <select
                  className={`pl-10 pr-4 py-3 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white border border-gray-300 text-gray-900'
                      : 'bg-gray-800 border border-gray-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none`}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <FaCode className={theme === 'light' ? 'absolute left-3 top-4 text-gray-500' : 'absolute left-3 top-4 text-gray-400'} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className={`${
                  theme === 'light' 
                    ? 'bg-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-800'
                } rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${animateCards ? "animate-fade-in" : ""}`}
              >
                <div className={`h-2 ${getDifficultyColor(problem.difficulty)}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {problem.title}
                    </h2>
                    {problem.completed && (
                      <FaCheckCircle className="text-green-500 text-xl" />
                    )}
                  </div>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-4 line-clamp-2`}>
                    {problem.description}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`flex items-center gap-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      <FaClock className="text-purple-500" />
                      {problem.timeLimit}
                    </span>
                    <span className={`flex items-center gap-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      <FaTrophy className="text-yellow-500" />
                      {problem.points} pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-white ${getDifficultyColor(problem.difficulty)}`}>
                      <FaStar className="inline-block mr-1" />
                      {problem.difficulty}
                    </span>
                    <button
                      className={`px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 ${
                        theme === 'light'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                      }`}
                      onClick={() => console.log(`View problem ${problem.id}`)}
                    >
                      Solve Problem
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-12">
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-lg`}>
                No problems found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;