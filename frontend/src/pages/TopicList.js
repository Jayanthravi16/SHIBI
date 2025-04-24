import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCode, FaLaptopCode, FaList } from 'react-icons/fa';

const TopicList = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTopicIcon = (topic) => {
    switch (topic) {
      case 'loops':
        return <FaCode className="w-6 h-6" />;
      case 'conditionals':
        return <FaLaptopCode className="w-6 h-6" />;
      case 'arrays':
        return <FaList className="w-6 h-6" />;
      default:
        return <FaCode className="w-6 h-6" />;
    }
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/questions/topics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTopics(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching topics:', error);
        setError('Failed to load topics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Topics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              onClick={() => navigate(`/topics/${topic}`)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-primary">
                  {getTopicIcon(topic)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white capitalize">{topic}</h2>
                  <p className="text-gray-400 mt-1">Practice {topic} problems</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicList; 