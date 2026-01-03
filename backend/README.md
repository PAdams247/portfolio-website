# Daily Planner Backend

Backend API for the Daily Planner application with user authentication and MongoDB storage.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your MongoDB connection string and JWT secret to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/plannerApp
JWT_SECRET=your_random_secret_key_here
PORT=3001
```

4. Start the server:
```bash
node server.js
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Planner
- `GET /api/planner/plan/:date` - Get plan for specific date
- `POST /api/planner/plan` - Create/update plan
- `POST /api/planner/create-tomorrow` - Auto-rollover unfinished tasks

## Database Structure

**Database**: `plannerApp`
- **Collection**: `users` - User accounts
- **Collection**: `dailyplans` - Daily planner data

## Deployment

Deploy to Render, Railway, or Heroku. Set environment variables in deployment platform.
