# Hybrid Express/Vercel Setup Guide

This project now supports both local Express development and Vercel serverless deployment.

## 🏗️ Architecture

### Local Development
- Traditional Express server (`server/server.js` or `server/server-hybrid.js`)
- All routes handled by Express middleware
- Database initialization on server startup
- CORS configured for local development ports

### Vercel Production
- Individual serverless functions in `/api` directory
- Each route is a separate function
- Database initialization per function call
- CORS configured for production domains

## 🚀 Available Scripts

### Local Development (Traditional Express)
```bash
npm run dev:all          # Start both frontend and backend (traditional)
npm run server:dev       # Start backend only (traditional)
```

### Local Development (Hybrid Mode)
```bash
npm run dev:hybrid       # Start both frontend and backend (hybrid)
npm run server:hybrid    # Start backend only (hybrid)
```

### Vercel Development
```bash
npm run vercel:dev       # Test with Vercel dev environment locally
```

### Vercel Deployment
```bash
npm run vercel:deploy    # Deploy to Vercel production
```

## 📁 API Structure

### Traditional Express Routes (Local)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/verify`
- `GET /api/favorites`
- `POST /api/favorites/add`
- `DELETE /api/favorites/:word`
- `DELETE /api/favorites/id/:id`
- `GET /api/favorites/check/:word`
- `GET /api/health`

### Vercel Serverless Functions
- `api/auth/register.js`
- `api/auth/login.js`
- `api/auth/profile.js`
- `api/auth/verify.js`
- `api/favorites/index.js`
- `api/favorites/add.js`
- `api/favorites/[word].js`
- `api/favorites/id/[id].js`
- `api/favorites/check/[word].js`
- `api/health.js`

## 🔧 How It Works

### Smart Detection
The hybrid server (`server-hybrid.js`) automatically detects if it's running on Vercel:
```javascript
const isVercel = process.env.VERCEL || process.env.NOW_REGION;
```

### Local Mode
- Starts Express server on specified port
- Initializes database on startup
- Uses traditional routing with middleware

### Vercel Mode
- Skips Express server startup
- Each function initializes independently
- Uses Vercel's routing configuration

### Shared Code
- Database models and utilities are shared
- Authentication logic is centralized in `/api/_shared/auth.js`
- CORS configuration is shared in `/api/_shared/cors.js`
- Database initialization is shared in `/api/_shared/init.js`

## 🛠️ Development Workflow

1. **Local Development**: Use `npm run dev:hybrid` for testing
2. **Vercel Testing**: Use `npm run vercel:dev` to test serverless functions locally
3. **Production**: Deploy with `npm run vercel:deploy`

## 📝 Environment Variables

Make sure these are set in both local `.env` and Vercel environment:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`

## 🔍 Debugging

### Check if running on Vercel:
```javascript
console.log('Is Vercel:', !!(process.env.VERCEL || process.env.NOW_REGION));
```

### Local logs:
- Express startup messages
- Database initialization logs
- CORS origin logs

### Vercel logs:
- Function-specific initialization
- Per-request database setup
- Serverless function execution logs
