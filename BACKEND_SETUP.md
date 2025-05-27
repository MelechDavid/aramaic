# Aramaic Dictionary App - Backend Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git repository connected to Vercel

### 1. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Create a database named 'aramaic_dictionary'
createdb aramaic_dictionary

# Update server/.env with your local connection
DATABASE_URL=postgresql://username:password@localhost:5432/aramaic_dictionary
```

#### Option B: Cloud Database (Recommended for Production)
We recommend using [Neon.tech](https://neon.tech) for free PostgreSQL hosting:

1. Sign up at neon.tech
2. Create a new database
3. Copy the connection string
4. Add to your environment variables

### 2. Environment Configuration

Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_generated_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Install & Run

```bash
# Install dependencies (from project root)
npm install

# Initialize database tables
npm run server:setup

# Start development (runs both frontend and backend)
npm run dev:all

# Or run separately:
npm run server:dev  # Backend only
npm run dev         # Frontend only
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/verify` - Verify JWT token

### Favorites
- `GET /api/favorites` - Get user's favorites (with pagination & search)
- `POST /api/favorites` - Add word to favorites
- `DELETE /api/favorites/:word` - Remove favorite by word
- `DELETE /api/favorites/id/:id` - Remove favorite by ID
- `GET /api/favorites/check/:word` - Check if word is favorited

## 🌐 Vercel Deployment

### 1. Set Environment Variables in Vercel Dashboard

In your Vercel project settings, add these environment variables:

```env
NODE_ENV=production
DATABASE_URL=your_production_postgresql_url
JWT_SECRET=your_production_jwt_secret
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### 2. Database Recommendations

**Neon.tech (Free tier available):**
```env
DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Railway (Free tier available):**
```env
DATABASE_URL=postgresql://username:password@containers-us-west-xxx.railway.app:xxxx/railway
```

**Supabase:**
```env
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
```

### 3. Build Configuration

The `vercel.json` file is already configured to:
- Serve the backend API from `/api/*` routes
- Serve the frontend from all other routes
- Handle both Node.js backend and static frontend

### 4. Automatic Deployment

Once connected to GitHub:
1. Push to main branch
2. Vercel automatically builds and deploys
3. Database tables are automatically created on first run

## 🔧 Development Scripts

```bash
npm run dev:all          # Run both frontend and backend
npm run server:dev       # Run backend with nodemon
npm run server:setup     # Initialize database tables
npm run build:vercel     # Build for production
```

## 🛡️ Security Features

- JWT authentication with 7-day expiration
- Password hashing with bcrypt (12 rounds)
- Input validation and sanitization
- CORS protection
- SQL injection protection via parameterized queries
- Rate limiting ready (can be enabled)

## 📊 Database Schema

### Users Table
```sql
id SERIAL PRIMARY KEY
username VARCHAR(50) UNIQUE NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Favorites Table
```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
word VARCHAR(255) NOT NULL
definition TEXT NOT NULL
pronunciation VARCHAR(255)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
UNIQUE(user_id, word)
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Ensure database exists
   - Verify network connectivity

2. **JWT Errors**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify CORS settings

3. **Vercel Deployment Issues**
   - Check environment variables in Vercel dashboard
   - Verify `vercel.json` configuration
   - Check build logs for errors

### Environment Variable Generator

Generate a new JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📱 Frontend Integration

The frontend automatically connects to the backend when:
- `VITE_API_URL` is set (defaults to `http://localhost:5000`)
- Authentication context is wrapped around the app
- Favorites context is available throughout components

### Usage in Components
```jsx
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const MyComponent = () => {
  const { user, login, logout } = useAuth();
  const { favorites, addToFavorites } = useFavorites();
  
  // Component logic
};
```

## 🎨 UI Features

- Responsive authentication modals
- User profile dropdown
- Favorites list with search and pagination
- Favorite buttons on dictionary entries
- Tab navigation between search and favorites

## 📈 Next Steps

1. Add rate limiting
2. Implement email verification
3. Add password reset functionality
4. Set up monitoring and logging
5. Add user preferences/settings
6. Implement word pronunciation features
7. Add study lists and flashcards

---

For questions or issues, check the error logs or refer to the troubleshooting section above.
