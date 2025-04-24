import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-darker">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block text-primary">Master Coding</span>
            <span className="block">Topic by Topic</span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-light mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Learn programming fundamentals through interactive coding challenges. 
            Start with the basics and progress at your own pace.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/login"
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-dark-lighter hover:bg-dark text-white font-semibold rounded-lg transition-all duration-300"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-dark p-6 rounded-xl shadow-lg">
            <div className="text-primary text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Topic-wise Learning</h3>
            <p className="text-gray-light">Master programming concepts one topic at a time with carefully curated challenges.</p>
          </div>
          
          <div className="bg-dark p-6 rounded-xl shadow-lg">
            <div className="text-primary text-4xl mb-4">💻</div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Code Editor</h3>
            <p className="text-gray-light">Write, test, and debug your code in real-time with our powerful code editor.</p>
          </div>
          
          <div className="bg-dark p-6 rounded-xl shadow-lg">
            <div className="text-primary text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-gray-light">Monitor your learning journey with detailed progress tracking and achievements.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing; 