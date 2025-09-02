const express = require('express');
const session = require('express-session');
const multer = require('multer');
const app = express();
const path = require('path');
const userRouter = require('./routes/userRouter');
const hostRouter = require('./routes/hostRouter');
const listingRouter = require('./routes/listingRouter');
const errorController = require('./controller/error');
const authRouter = require('./routes/authRouter');
const rootdir = require('./util/pathUtil');
const { default: mongoose } = require('mongoose');

const PORT = 3002;
const DB_URL = 'mongodb+srv://root:root@umesh.ptbfljn.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Umesh';

console.log('Starting application...');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(rootdir, 'public')));

// Session management
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false, // Only create session when necessary
  cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Auth state available to all views
app.use((req, res, next) => {
  const isAuthenticated = req.session && req.session.isLoggedIn;
  req.isLoggedIn = isAuthenticated;
  res.locals.isAuthenticated = isAuthenticated;
  next();
});

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
