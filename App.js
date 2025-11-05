require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const path = require('path');
const userRouter = require('./routes/userRouter');
const hostRouter = require('./routes/hostRouter');
const listingRouter = require('./routes/listingRouter');
const errorController = require('./controller/error');
const authRouter = require('./routes/authRouter');
const rootdir = require('./util/pathUtil');
const { default: mongoose } = require('mongoose');
const { attachUser } = require('./middleware/auth');

// Configuration from environment variables
const PORT = process.env.PORT || 3002;
const DB_URL = process.env.DB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production';
const NODE_ENV = process.env.NODE_ENV || 'development';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';

// Validate critical environment variables
if (!DB_URL) {
  console.error('❌ FATAL ERROR: DB_URL is not defined in .env file');
  process.exit(1);
}

console.log('Starting application...');
console.log(`Environment: ${NODE_ENV}`);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.tailwindcss.com", "unpkg.com", "cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdn.tailwindcss.com", "cdn.jsdelivr.net"],
      fontSrc: ["'self'", "fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Compression middleware
app.use(compression());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(rootdir, 'public')));

// Session management
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: COOKIE_SECURE, // true in production with HTTPS
    httpOnly: true, // Prevents XSS attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Auth state available to all views
app.use((req, res, next) => {
  const isAuthenticated = req.session && req.session.isLoggedIn;
  req.isLoggedIn = isAuthenticated;
  res.locals.isAuthenticated = isAuthenticated;
  next();
});

// Attach user info to all requests
app.use(attachUser);

// Public routes
app.use(userRouter);
app.use(authRouter);
app.use(listingRouter);

app.use('/host', hostRouter);

app.use(errorController.pageNotFound);

// DB connect & start server
mongoose.connect(DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// Password hashing example (to be used in the relevant route/controller)
// const hashedPassword = await bcrypt.hash(password, 12);
