const mongoose = require('mongoose');
const Question = require('./models/Question');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const questions = [
  // Loops Topic
  {
    title: "Print Numbers from 1 to N",
    description: "Write a program to print numbers from 1 to N using a loop.",
    topic: "loops",
    difficulty: "easy",
    testCases: [
      { input: "5", output: "1\n2\n3\n4\n5" },
      { input: "3", output: "1\n2\n3" }
    ],
    starterCode: {
      python: "def print_numbers(n):\n    # Write your code here\n    pass",
      java: "public class Solution {\n    public static void printNumbers(int n) {\n        // Write your code here\n    }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nvoid printNumbers(int n) {\n    // Write your code here\n}"
    },
    solution: {
      python: "def print_numbers(n):\n    for i in range(1, n + 1):\n        print(i)",
      java: "public class Solution {\n    public static void printNumbers(int n) {\n        for (int i = 1; i <= n; i++) {\n            System.out.println(i);\n        }\n    }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nvoid printNumbers(int n) {\n    for (int i = 1; i <= n; i++) {\n        cout << i << endl;\n    }\n}"
    },
    hints: ["Use a for loop", "Start from 1 and go up to n"],
    order: 1
  },
  {
    title: "Sum of Even Numbers",
    description: "Write a program to find the sum of all even numbers from 1 to N.",
    topic: "loops",
    difficulty: "medium",
    testCases: [
      { input: "10", output: "30" },
      { input: "5", output: "6" }
    ],
    starterCode: {
      python: "def sum_even_numbers(n):\n    # Write your code here\n    pass",
      java: "public class Solution {\n    public static int sumEvenNumbers(int n) {\n        // Write your code here\n        return 0;\n    }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nint sumEvenNumbers(int n) {\n    // Write your code here\n    return 0;\n}"
    },
    solution: {
      python: "def sum_even_numbers(n):\n    sum = 0\n    for i in range(2, n + 1, 2):\n        sum += i\n    return sum",
      java: "public class Solution {\n    public static int sumEvenNumbers(int n) {\n        int sum = 0;\n        for (int i = 2; i <= n; i += 2) {\n            sum += i;\n        }\n        return sum;\n    }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nint sumEvenNumbers(int n) {\n    int sum = 0;\n    for (int i = 2; i <= n; i += 2) {\n        sum += i;\n    }\n    return sum;\n}"
    },
    hints: ["Use a for loop with step 2", "Start from 2 and add only even numbers"],
    order: 2
  },
  
  // Conditionals Topic
  {
    title: "Check Even or Odd",
    description: "Write a program to check if a number is even or odd.",
    topic: "conditionals",
    difficulty: "easy",
    testCases: [
      { input: "4", output: "Even" },
      { input: "7", output: "Odd" }
    ],
    starterCode: {
      python: "def check_even_odd(n):\n    # Write your code here\n    pass",
      java: "public class Solution {\n    public static String checkEvenOdd(int n) {\n        // Write your code here\n        return \"\";\n    }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nstring checkEvenOdd(int n) {\n    // Write your code here\n    return \"\";\n}"
    },
    solution: {
      python: "def check_even_odd(n):\n    if n % 2 == 0:\n        return \"Even\"\n    else:\n        return \"Odd\"",
      java: "public class Solution {\n    public static String checkEvenOdd(int n) {\n        if (n % 2 == 0) {\n            return \"Even\";\n        } else {\n            return \"Odd\";\n        }\n    }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nstring checkEvenOdd(int n) {\n    if (n % 2 == 0) {\n        return \"Even\";\n    } else {\n        return \"Odd\";\n    }\n}"
    },
    hints: ["Use modulo operator (%)", "Check if remainder is 0"],
    order: 1
  },
  {
    title: "Find Maximum of Three Numbers",
    description: "Write a program to find the maximum of three numbers.",
    topic: "conditionals",
    difficulty: "medium",
    testCases: [
      { input: "5 10 3", output: "10" },
      { input: "1 1 1", output: "1" }
    ],
    starterCode: {
      python: "def find_max(a, b, c):\n    # Write your code here\n    pass",
      java: "public class Solution {\n    public static int findMax(int a, int b, int c) {\n        // Write your code here\n        return 0;\n    }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nint findMax(int a, int b, int c) {\n    // Write your code here\n    return 0;\n}"
    },
    solution: {
      python: "def find_max(a, b, c):\n    if a >= b and a >= c:\n        return a\n    elif b >= a and b >= c:\n        return b\n    else:\n        return c",
      java: "public class Solution {\n    public static int findMax(int a, int b, int c) {\n        if (a >= b && a >= c) {\n            return a;\n        } else if (b >= a && b >= c) {\n            return b;\n        } else {\n            return c;\n        }\n    }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nint findMax(int a, int b, int c) {\n    if (a >= b && a >= c) {\n        return a;\n    } else if (b >= a && b >= c) {\n        return b;\n    } else {\n        return c;\n    }\n}"
    },
    hints: ["Use if-else statements", "Compare each number with others"],
    order: 2
  },
  
  // Arrays Topic
  {
    title: "Find Sum of Array",
    description: "Write a program to find the sum of all elements in an array.",
    topic: "arrays",
    difficulty: "easy",
    testCases: [
      { input: "[1, 2, 3, 4, 5]", output: "15" },
      { input: "[10, 20, 30]", output: "60" }
    ],
    starterCode: {
      python: "def sum_array(arr):\n    # Write your code here\n    pass",
      java: "public class Solution {\n    public static int sumArray(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint sumArray(vector<int>& arr) {\n    // Write your code here\n    return 0;\n}"
    },
    solution: {
      python: "def sum_array(arr):\n    return sum(arr)",
      java: "public class Solution {\n    public static int sumArray(int[] arr) {\n        int sum = 0;\n        for (int num : arr) {\n            sum += num;\n        }\n        return sum;\n    }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint sumArray(vector<int>& arr) {\n    int sum = 0;\n    for (int num : arr) {\n        sum += num;\n    }\n    return sum;\n}"
    },
    hints: ["Use a loop to iterate through the array", "Keep a running sum"],
    order: 1
  },
  {
    title: "Find Maximum in Array",
    description: "Write a program to find the maximum element in an array.",
    topic: "arrays",
    difficulty: "medium",
    testCases: [
      { input: "[5, 10, 3, 8, 1]", output: "10" },
      { input: "[1, 1, 1, 1]", output: "1" }
    ],
    starterCode: {
      python: "def find_max_in_array(arr):\n    # Write your code here\n    pass",
      java: "public class Solution {\n    public static int findMaxInArray(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint findMaxInArray(vector<int>& arr) {\n    // Write your code here\n    return 0;\n}"
    },
    solution: {
      python: "def find_max_in_array(arr):\n    return max(arr)",
      java: "public class Solution {\n    public static int findMaxInArray(int[] arr) {\n        int max = arr[0];\n        for (int num : arr) {\n            if (num > max) {\n                max = num;\n            }\n        }\n        return max;\n    }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint findMaxInArray(vector<int>& arr) {\n    int max = arr[0];\n    for (int num : arr) {\n        if (num > max) {\n            max = num;\n        }\n    }\n    return max;\n}"
    },
    hints: ["Initialize max with first element", "Compare each element with max"],
    order: 2
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shibi');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert new questions
    await Question.insertMany(questions);
    console.log('Inserted new questions');

    // Update user progress for the new topics
    await User.updateMany(
      {},
      {
        $set: {
          progress: new Map([
            ['loops', { completed: 0, total: 2 }],
            ['conditionals', { completed: 0, total: 2 }],
            ['arrays', { completed: 0, total: 2 }]
          ])
        }
      }
    );
    console.log('Updated user progress');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 