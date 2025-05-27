// CORS configuration for Vercel serverless functions
const cors = (req, res, next) => {
  const origin = req.headers?.origin;
  
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        'https://aramaic-git-backend-melechdavids-projects.vercel.app',
        'https://aramaic-melechdavids-projects.vercel.app',
        'https://aramaic.vercel.app'
      ]
    : []; // In development, allow all origins

  // Allow requests with no origin (like mobile apps, Postman, etc.)
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (process.env.NODE_ENV === 'production') {
    // Production: check against allowed origins
    const isAllowed = allowedOrigins.some(allowed => 
      allowed === origin || 
      (allowed.includes('*') && origin.match(allowed.replace('*', '.*')))
    ) || /^https:\/\/aramaic-.*\.vercel\.app$/.test(origin);
    
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else {
    // Development: allow localhost and 127.0.0.1 on common dev ports
    const devOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1):(3000|4000|5000|5001|5173|5174|5175|8080|8000)$/;
    if (devOriginPattern.test(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (next) next();
};

module.exports = cors;
