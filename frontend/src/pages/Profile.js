import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(response.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    const fetchCompletedQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/completed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompletedQuestions(response.data);
      } catch (error) {
        console.error('Error fetching completed questions:', error);
      }
    };

    fetchUserData();
    fetchProgress();
    fetchCompletedQuestions();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-dark rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center space-x-4">
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-light">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-dark rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Progress Overview</h2>
            <div className="space-y-4">
              {Object.entries(progress).map(([topic, data]) => (
                <div key={topic}>
                  <div className="flex justify-between text-sm text-gray-light mb-1">
                    <span className="capitalize">{topic}</span>
                    <span>
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <div className="w-full bg-dark-lighter rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(data.completed / data.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Completed Questions</h2>
            {completedQuestions.length > 0 ? (
              <div className="space-y-2">
                {completedQuestions.map((question) => (
                  <div
                    key={question._id}
                    className="bg-dark-lighter rounded-lg p-3"
                  >
                    <h3 className="text-white font-medium">{question.title}</h3>
                    <p className="text-gray-light text-sm">
                      Completed on {new Date(question.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-light">No questions completed yet.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 