const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Piston API endpoint
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

// Create a temporary directory for code execution
const createTempDir = async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-'));
  return tempDir;
};

// Write code to a file
const writeCodeToFile = async (dir, code, language) => {
  const extension = language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java';
  const filePath = path.join(dir, `main.${extension}`);
  await fs.writeFile(filePath, code);
  return filePath;
};

// Get language ID for Piston
const getLanguageId = (language) => {
  switch (language) {
    case 'python':
      return 'python';
    case 'cpp':
      return 'cpp';
    case 'java':
      return 'java';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

// Get language version for Piston
const getLanguageVersion = (language) => {
  switch (language) {
    case 'python':
      return '3.10.0';
    case 'cpp':
      return '10.2.0';
    case 'java':
      return '15.0.2';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

// Clean and normalize output for comparison
const normalizeOutput = (output) => {
  if (!output) return '';
  return output
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '\n')
    .trim();
};

// Run code without test cases
const runCode = async (code, language) => {
  try {
    const response = await axios.post(PISTON_API_URL, {
      language: getLanguageId(language),
      version: getLanguageVersion(language),
      files: [
        {
          name: `main.${language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}`,
          content: code
        }
      ]
    });

    if (response.data.run) {
      const output = normalizeOutput(response.data.run.output);
      const error = response.data.run.stderr ? normalizeOutput(response.data.run.stderr) : '';
      
      return {
        output,
        error
      };
    } else {
      return {
        output: '',
        error: 'Execution failed'
      };
    }
  } catch (error) {
    return {
      output: '',
      error: `API error: ${error.message}`
    };
  }
};

// Run code with test cases
const runTests = async (code, language, testCases) => {
  try {
    const results = [];

    for (const testCase of testCases) {
      const { input, output: expectedOutput } = testCase;
      
      const response = await axios.post(PISTON_API_URL, {
        language: getLanguageId(language),
        version: getLanguageVersion(language),
        files: [
          {
            name: `main.${language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}`,
            content: code
          }
        ],
        stdin: input
      });

      if (response.data.run) {
        const actualOutput = normalizeOutput(response.data.run.output);
        const expected = normalizeOutput(expectedOutput);
        const passed = actualOutput === expected;
        
        results.push({
          input,
          expectedOutput: expected,
          actualOutput,
          passed,
          error: response.data.run.stderr ? normalizeOutput(response.data.run.stderr) : ''
        });
      } else {
        results.push({
          input,
          expectedOutput: normalizeOutput(expectedOutput),
          actualOutput: '',
          passed: false,
          error: 'Execution failed'
        });
      }
    }

    return results;
  } catch (error) {
    return [{
      input: 'Error',
      expectedOutput: '',
      actualOutput: '',
      passed: false,
      error: `API error: ${error.message}`
    }];
  }
};

module.exports = {
  runCode,
  runTests
}; 