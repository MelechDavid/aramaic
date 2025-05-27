const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  // Username validation
  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username && username.length > 50) {
    errors.push('Username must be less than 50 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password && password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateFavorite = (req, res, next) => {
  const { word, definition } = req.body;
  const errors = [];

  if (!word || word.trim().length === 0) {
    errors.push('Word is required');
  }

  if (!definition || definition.trim().length === 0) {
    errors.push('Definition is required');
  }

  if (word && word.length > 255) {
    errors.push('Word must be less than 255 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateFavorite
};
