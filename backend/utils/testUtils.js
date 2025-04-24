const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const runTests = async (code, language, testCases) => {
  const testResults = [];
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-test-'));
  
  try {
    // Create temporary files
    const filePath = path.join(tempDir, `main.${getFileExtension(language)}`);
    await fs.writeFile(filePath, code);

    // Run each test case
    for (const testCase of testCases) {
      const result = await runTestCase(filePath, language, testCase);
      testResults.push(result);
    }
  } finally {
    // Clean up temporary files
    await fs.rm(tempDir, { recursive: true, force: true });
  }

  return testResults;
};

const runTestCase = async (filePath, language, testCase) => {
  try {
    const command = getRunCommand(language, filePath);
    const { stdout, stderr } = await executeCommand(command, testCase.input);
    
    if (stderr) {
      return {
        passed: false,
        expected: testCase.output,
        actual: stderr,
        output: stderr,
        error: true
      };
    }

    const actual = stdout.trim();
    const expected = testCase.output.trim();
    
    return {
      passed: actual === expected,
      expected,
      actual,
      output: stdout
    };
  } catch (error) {
    return {
      passed: false,
      expected: testCase.output,
      actual: error.message,
      output: error.message,
      error: true
    };
  }
};

const executeCommand = (command, input) => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });

    if (input) {
      process.stdin.write(input);
      process.stdin.end();
    }
  });
};

const getFileExtension = (language) => {
  switch (language) {
    case 'python':
      return 'py';
    case 'java':
      return 'java';
    case 'cpp':
      return 'cpp';
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

const getRunCommand = (language, filePath) => {
  switch (language) {
    case 'python':
      return `python ${filePath}`;
    case 'java':
      return `java ${filePath}`;
    case 'cpp':
      return `g++ ${filePath} -o ${filePath}.out && ${filePath}.out`;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

module.exports = {
  runTests
}; 