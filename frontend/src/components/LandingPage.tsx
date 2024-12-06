import React from "react";
import { BsHouseDoor, BsCode, BsPerson, BsTrophy, BsBook, BsPeople, BsArrowRight } from "react-icons/bs";
import Header from "./Header";

const Home = () => {
  const featuredProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      solvedCount: 245678
    },
    {
      id: 2,
      title: "Reverse Linked List",
      difficulty: "Medium",
      category: "Linked Lists",
      solvedCount: 189432
    },
    {
      id: 3,
      title: "Binary Tree Maximum Path",
      difficulty: "Hard",
      category: "Trees",
      solvedCount: 98765
    }
  ];

  const learningPaths = [
    {
      title: "DSA Fundamentals",
      description: "Master the basics of Data Structures and Algorithms",
      problemCount: 50,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea"
    },
    {
      title: "Dynamic Programming",
      description: "Advanced problem-solving techniques",
      problemCount: 40,
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904"
    },
    {
      title: "System Design",
      description: "Learn to design scalable systems",
      problemCount: 30,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header (keeping the same header from ProblemShowcase) */}
      <Header />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Master Your Coding Journey</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">Join millions of developers who are improving their coding skills through interactive problem-solving and real-world challenges.</p>
          <div className="flex justify-center space-x-6">
            <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl flex items-center">
              Start Practicing <BsArrowRight className="ml-2" />
            </button>
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl border border-indigo-100">
              View Problems
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-gray-600">Coding Problems</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">500K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">20+</div>
              <div className="text-gray-600">Learning Paths</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Problems</h2>
        <div className="grid grid-cols-3 gap-8">
          {featuredProblems.map((problem) => (
            <div key={problem.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-purple-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{problem.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${problem.difficulty === "Easy" ? "bg-green-100 text-green-700" : problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="text-gray-600 mb-4">{problem.category}</div>
              <div className="flex items-center text-gray-500">
                <BsTrophy className="mr-2" />
                {problem.solvedCount.toLocaleString()} solved
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Paths */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Learning Paths</h2>
        <div className="grid grid-cols-3 gap-8">
          {learningPaths.map((path, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-purple-100">
              <img src={path.image} alt={path.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{path.title}</h3>
                <p className="text-gray-600 mb-4">{path.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center">
                    <BsBook className="mr-2" />
                    {path.problemCount} problems
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">Start Learning</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 opacity-90">Connect with fellow developers, share solutions, and learn together</p>
          <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl flex items-center mx-auto">
            <BsPeople className="mr-2" /> Join Community
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
