import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const TopicQuestions = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/questions/topic/${topic}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setQuestions(response.data);
        } else {
          throw new Error('No questions found');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          setError('Failed to load questions. Retrying...');
          setTimeout(fetchQuestions, 2000); // Retry after 2 seconds
        } else {
          setError('Failed to load questions. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, navigate, retryCount]);

  const handleRetry = () => {
    setRetryCount(0);
    setLoading(true);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          {retryCount > 0 && (
            <p className="text-gray-400">Retrying... ({retryCount}/3)</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/topics')}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white capitalize">{topic} Questions</h1>
          <button
            onClick={() => navigate('/topics')}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
          >
            Back to Topics
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            No questions available for this topic yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                onClick={() => navigate(`/questions/${question._id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">{question.title}</h2>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {question.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 mb-4 line-clamp-2">{question.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Order: {question.order}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/questions/${question._id}`);
                    }}
                    className="px-3 py-1 text-sm font-medium text-primary hover:text-primary/90 transition-colors duration-200"
                  >
                    Start
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicQuestions; 