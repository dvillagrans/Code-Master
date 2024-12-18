import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

const features: Feature[] = [
  {
    title: "Customizable Learning",
    description: "Tailor your learning experience to match your goals and schedule",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
  },
  {
    title: "Project-Based Learning",
    description: "Build real projects and add them to your portfolio as you learn",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    title: "Expert Mentorship",
    description: "Get guidance from experienced developers in our community",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
];

const SideContent = () => {
  return (
    <div className="hidden lg:block lg:w-7/12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-12">
      <div className="h-full flex flex-col justify-center items-center text-gray-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Start Your Journey Today
        </h1>
        <p className="text-xl mb-12 text-gray-600 dark:text-gray-300 text-center max-w-2xl">
          Join thousands of developers who are already part of our community
        </p>

        {/* Features Section */}
        <div className="w-full max-w-3xl space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * (index + 1) }}
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm mt-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Sarah Johnson</h4>
              <p className="text-gray-600 dark:text-gray-300">Full Stack Developer</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 italic">
            "CodeMaster Pro transformed my coding journey. The structured
            learning path and supportive community helped me land my dream job
            in tech."
          </p>
        </motion.div>

        {/* Progress Indicators */}
        <div className="flex space-x-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600 dark:bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600 dark:bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default SideContent;
