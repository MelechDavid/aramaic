# Vercel Deployment Guide

## Overview
This project is now configured for hybrid deployment - it works both locally and on Vercel as serverless functions.

## Pre-Deployment Checklist

### 1. Environment Variables
Set these in your Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

### 2. Database Setup
Ensure your PostgreSQL database is accessible from Vercel. Common options:
- Vercel Postgres
- Supabase
- Railway
- Neon
- Amazon RDS

### 3. Files Structure
```
api/
├── package.json          (CommonJS config + dependencies)
├── _shared/              (Shared utilities for serverless)
│   ├── auth.js
│   ├── cors.js
│   ├── database.js
│   ├── Favorite.js
│   ├── init.js
│   ├── User.js
│   └── utils.js
├── auth/                 (Authentication endpoints)
│   ├── login.js
│   ├── profile.js
│   ├── register.js
│   └── verify.js
└── favorites/            (Favorites endpoints)
    ├── index.js
    ├── [word].js
    ├── check/[word].js
    └── id/[id].js
```

## Deployment Commands

### Option 1: Automatic Deployment
Connect your GitHub repository to Vercel for automatic deployments on push.

### Option 2: Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
npm run vercel:deploy
```

### Option 3: Vercel CLI
```bash
# Link your project (first time only)
vercel link

# Deploy
vercel --prod
```

## Local Development

```bash
# Start hybrid development (recommended)
npm run dev:hybrid

# Or start separately
npm run dev           # Frontend only
npm run server:hybrid # Backend only
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/verify` - Verify JWT token

### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add new favorite
- `DELETE /api/favorites/[word]` - Remove favorite by word
- `DELETE /api/favorites/id/[id]` - Remove favorite by ID
- `GET /api/favorites/check/[word]` - Check if word is favorited

### Health
- `GET /api/health` - Health check

## Testing

Use the test file: `test-hybrid-api.html`

## Troubleshooting

### Build Errors
1. Check environment variables are set in Vercel
2. Ensure database is accessible from Vercel's IP ranges
3. Verify all dependencies are in `api/package.json`

### Runtime Errors
1. Check Vercel function logs
2. Verify JWT_SECRET is set correctly
3. Test database connection manually

### CORS Issues
1. Update allowed origins in `api/_shared/cors.js`
2. Verify frontend domain is in the whitelist

## Architecture Notes

- **Hybrid Mode**: Same codebase works locally (Express) and on Vercel (serverless)
- **Shared Code**: Common utilities in `api/_shared/` avoid duplication
- **Environment Detection**: Auto-detects Vercel vs local environment
- **Database**: Per-function initialization for serverless, app-startup for local
