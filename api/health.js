const cors = require('./_shared/cors');

module.exports = async (req, res) => {
  // Handle CORS
  cors(req, res);
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.json({ message: 'Server is running!' });
};
