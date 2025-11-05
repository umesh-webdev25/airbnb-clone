const validator = require('validator');

// Validation middleware for user registration
exports.validateRegistration = (req, res, next) => {
  const { name, username, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < 2 || name.trim().length > 50) {
    errors.push('Name must be between 2 and 50 characters');
  }

  // Username validation
  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  } else if (username.trim().length < 3 || username.trim().length > 30) {
    errors.push('Username must be between 3 and 30 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  // Email validation
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
  }

  // If there are errors, return to form with error messages
  if (errors.length > 0) {
    return res.status(400).render('host/home', {
      editing: false,
      errorMessage: errors.join('. '),
      isLoggedIn: req.isLoggedIn || false
    });
  }

  // Sanitize inputs
  req.body.name = validator.escape(name.trim());
  req.body.username = validator.escape(username.trim());
  req.body.email = validator.normalizeEmail(email);

  next();
};

// Validation middleware for login
exports.validateLogin = (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  const errors = [];

  // Email/Username validation
  if (!emailOrUsername || emailOrUsername.trim().length === 0) {
    errors.push('Email or username is required');
  }

  // Password validation
  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  // If there are errors, return to login with error messages
  if (errors.length > 0) {
    return res.status(400).render('store/login', {
      isLoggedIn: false,
      errorMessage: errors.join('. '),
      values: { emailOrUsername }
    });
  }

  next();
};

// Validation middleware for listing creation
exports.validateListing = (req, res, next) => {
  const { home, country, city, price } = req.body;
  const errors = [];

  // Home name validation
  if (!home || home.trim().length === 0) {
    errors.push('Property name is required');
  } else if (home.trim().length < 3 || home.trim().length > 100) {
    errors.push('Property name must be between 3 and 100 characters');
  }

  // Country validation
  if (!country || country.trim().length === 0) {
    errors.push('Country is required');
  } else if (country.trim().length < 2 || country.trim().length > 50) {
    errors.push('Country name must be between 2 and 50 characters');
  }

  // City validation
  if (!city || city.trim().length === 0) {
    errors.push('City is required');
  } else if (city.trim().length < 2 || city.trim().length > 50) {
    errors.push('City name must be between 2 and 50 characters');
  }

  // Price validation
  const priceNum = Number(price);
  if (isNaN(priceNum)) {
    errors.push('Price must be a valid number');
  } else if (priceNum < 0) {
    errors.push('Price cannot be negative');
  } else if (priceNum > 10000000) {
    errors.push('Price seems too high. Please check your input');
  }

  // If there are errors, return to form with error messages
  if (errors.length > 0) {
    return res.status(400).render('host/listing-form', {
      isLoggedIn: req.isLoggedIn,
      errorMessage: errors.join('. '),
      values: { home, country, city, price }
    });
  }

  // Sanitize inputs
  req.body.home = validator.escape(home.trim());
  req.body.country = validator.escape(country.trim());
  req.body.city = validator.escape(city.trim());

  next();
};
