# Full Stack TypeScript Template

A modern, production-ready template for building full-stack applications with TypeScript, featuring a Node.js/Express backend and Next.js frontend.

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Server entry point
│   ├── .env                # Environment variables
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   └── app/           # Next.js application
│   ├── public/            # Static assets
│   ├── tsconfig.json      # TypeScript configuration
│   └── package.json       # Frontend dependencies
```

## Features

### Backend
- TypeScript-first development
- Express.js with modern ES modules
- MongoDB integration with Mongoose
- JWT authentication ready
- Winston logger setup
- CORS configured for frontend
- ESLint + Prettier code formatting
- Jest testing setup

### Frontend
- Next.js 13+ with App Router
- TypeScript configuration
- ESLint + Prettier integration
- Modern styling setup
- Public assets management

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn package manager
- MongoDB (local or remote)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
yarn install
```

3. Create `.env` file with required variables:
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Available commands:
```bash
yarn dev      # Start development server with hot reload
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
yarn format   # Format code with Prettier
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
yarn install
```

3. Start development server:
```bash
yarn dev
```

4. Available commands:
```bash
yarn dev      # Start development server
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
```

## Development Guidelines

### Backend
- Use TypeScript for all new files
- Follow the established folder structure
- Add types for all functions and variables
- Use async/await for asynchronous operations
- Write unit tests for critical functionality

### Frontend
- Follow Next.js 13+ best practices
- Use TypeScript for type safety
- Keep components small and focused
- Follow the established project structure

## API Documentation

The backend API is available at `http://localhost:8000/api`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.