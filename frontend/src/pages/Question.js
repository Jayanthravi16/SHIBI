import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import api from '../utils/api';

const Question = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get(`/questions/${id}`);
        setQuestion(response.data);
        
        // Set initial code based on language
        const initialCode = getInitialCode(response.data.starterCode[language] || '', language);
        setCode(initialCode);
        
        setIsCompleted(response.data.isCompleted || false);
      } catch (error) {
        console.error('Error fetching question:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        setError('Failed to load question. Please try again.');
      }
    };

    fetchQuestion();
  }, [id, language, navigate]);

  const getInitialCode = (starterCode, language) => {
    if (starterCode) return starterCode;

    switch (language) {
      case 'python':
        return `def solution(input):
    # Write your code here
    pass

# Read input
input = input()
# Call solution and print result
print(solution(input))`;
      case 'cpp':
        return `#include <iostream>
#include <string>
using namespace std;

string solution(string input) {
    // Write your code here
    return "";
}

int main() {
    string input;
    getline(cin, input);
    cout << solution(input) << endl;
    return 0;
}`;
      case 'java':
        return `import java.util.Scanner;

public class Main {
    public static String solution(String input) {
        // Write your code here
        return "";
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        System.out.println(solution(input));
        scanner.close();
    }
}`;
      default:
        return '';
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    const newCode = getInitialCode(question.starterCode[newLanguage] || '', newLanguage);
    setCode(newCode);
    setTestResults([]);
    setOutput(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const response = await api.post(`/questions/${id}/run`, { code, language });
      setOutput(response.data);
      setTestResults([]);
    } catch (error) {
      console.error('Error running code:', error);
      setError('Failed to run code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await api.post(`/questions/${id}/submit`, { code, language });
      setTestResults(response.data.testResults);
      const allTestsPassed = response.data.testResults.every(result => result.passed);
      
      if (allTestsPassed) {
        setIsCompleted(true);
        setIsCorrect(true);
        alert('Congratulations! Question marked as completed!');
      } else {
        // Show which test cases failed with better formatting
        const failedTests = response.data.testResults
          .filter(result => !result.passed)
          .map((result, index) => {
            const testCase = question.testCases[index];
            return `Test Case ${index + 1}:
Input: ${testCase.input}
Expected: ${result.expectedOutput}
Got: ${result.actualOutput}
${result.error ? `Error: ${result.error}` : ''}`;
          });
        
        setError(`Some test cases failed:\n\n${failedTests.join('\n\n')}`);
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setError('Failed to submit solution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">{question.title}</h1>
            {isCompleted && (
              <span className="px-3 py-1 text-sm font-medium text-green-400 bg-green-500/20 rounded-full">
                Completed
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/topics/${question.topic}`)}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
            >
              Back to Questions
            </button>
            <button
              onClick={() => navigate('/topics')}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
            >
              All Topics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Description</h2>
              <div className="prose prose-invert">
                <p className="text-gray-300">{question.description}</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Test Cases</h2>
              <div className="space-y-4">
                {question.testCases.map((testCase, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="text-gray-400">Input:</span>
                      <pre className="mt-1 text-sm text-gray-300">{testCase.input}</pre>
                    </div>
                    <div>
                      <span className="text-gray-400">Expected Output:</span>
                      <pre className="mt-1 text-sm text-gray-300">{testCase.output}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Code Editor</h2>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <div className="h-[400px] border border-gray-700 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={setCode}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={handleRun}
                  disabled={isRunning || isCompleted}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isRunning || isCompleted ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors duration-200`}
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isCompleted}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isSubmitting || isCompleted ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
                  } transition-colors duration-200`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                </button>
                {!isCorrect && !isCompleted && (
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline whitespace-pre-line font-mono text-sm">{error}</span>
              </div>
            )}

            {output && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Output</h2>
                <div className="bg-gray-700 p-4 rounded-lg">
                  {output.error ? (
                    <pre className="text-red-400 text-sm font-mono">{output.error}</pre>
                  ) : (
                    <pre className="text-gray-300 text-sm font-mono">{output.output}</pre>
                  )}
                </div>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div key={index} className={`bg-gray-700 p-4 rounded-lg ${result.passed ? 'border border-green-500/20' : 'border border-red-500/20'}`}>
                      <div className="mb-2">
                        <span className="text-gray-400">Test Case {index + 1}:</span>
                        <div className="mt-2">
                          <span className="text-gray-400">Input:</span>
                          <pre className="mt-1 text-sm text-gray-300 font-mono">{result.input}</pre>
                        </div>
                        <div className="mt-2">
                          <span className="text-gray-400">Expected Output:</span>
                          <pre className="mt-1 text-sm text-gray-300 font-mono">{result.expectedOutput}</pre>
                        </div>
                        <div className="mt-2">
                          <span className="text-gray-400">Actual Output:</span>
                          <pre className="mt-1 text-sm text-gray-300 font-mono">{result.actualOutput}</pre>
                        </div>
                        <div className="mt-2">
                          <span className={`text-sm font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                            {result.passed ? '✓ Test Passed' : '✗ Test Failed'}
                          </span>
                        </div>
                        {result.error && (
                          <div className="mt-2">
                            <span className="text-red-400">Error:</span>
                            <pre className="mt-1 text-sm text-red-400 font-mono">{result.error}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSolution && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Solution</h2>
                <div className="h-[200px] border border-gray-700 rounded-lg overflow-hidden">
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={question.solution?.[language] || 'Solution not available for this language.'}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question; 