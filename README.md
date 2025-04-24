# Shibi - Topic-wise Coding Practice Platform

A modern coding practice platform focused on topic-wise learning, featuring a beautiful dark UI, interactive code editor, and progress tracking.

## Features

- 🎨 Modern dark-themed UI with animations
- 🔐 Google Authentication
- 📚 Topic-wise question organization
- 💻 Monaco Code Editor with multiple language support
- ✅ Automatic test case validation
- 📊 Progress tracking
- 🔄 Persistent learning progress

## Tech Stack

- Frontend: React, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Google OAuth
- Code Editor: Monaco Editor
- Compiler: Pipe Online Compiler API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shibi
   ```

2. Set up environment variables:
   - Create `.env` file in the backend directory:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/shibi
     JWT_SECRET=your_jwt_secret_key_here
     GOOGLE_CLIENT_ID=your_google_client_id_here
     ```

3. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. Seed the database:
   ```bash
   cd backend
   npm run seed
   ```

5. Start the development servers:
   ```bash
   # Start both frontend and backend
   cd backend
   npm run dev:all
   ```

   Or start them separately:
   ```bash
   # Start backend
   cd backend
   npm run dev

   # Start frontend
   cd frontend
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
shibi/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/     # Page components
│   │   └── ...
│   └── ...
├── backend/           # Node.js/Express backend
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── ...
└── README.md         # Project documentation
```

## Available Topics

- Loops
- Conditionals
- Arrays
- Functions
- Strings

Each topic contains beginner-friendly questions with test cases and solutions in multiple programming languages (Python, Java, C++).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 