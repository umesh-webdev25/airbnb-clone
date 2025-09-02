const Home = require('../models/home');

// GET /login
exports.login = (req, res) => {
  res.render('store/login', { isLoggedIn: false, errorMessage: null, values: {} });
};

// POST /login
exports.postLogin = async (req, res) => {
  try {
    const rawIdentifier = req.body?.emailOrUsername || '';
    const rawPassword = req.body?.password || '';

    const emailOrUsername = String(rawIdentifier).trim();
    const password = String(rawPassword);

    if (!emailOrUsername || !password) {
      return res.status(400).render('store/login', {
        isLoggedIn: false,
        errorMessage: 'Email/Username and password are required',
        values: { emailOrUsername }
      });
    }

    const user = await Home.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });

    if (!user || user.password !== password) {
      return res.status(401).render('store/login', {
        isLoggedIn: false,
        errorMessage: 'Invalid username/email or password',
        values: { emailOrUsername }
      });
    }

    // Set session data
    req.session.isLoggedIn = true;
    req.session.user = { id: user._id, username: user.username, email: user.email };

    res.redirect('/index');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('store/login', {
      isLoggedIn: false,
      errorMessage: 'Something went wrong. Please try again later.',
      values: { emailOrUsername: req.body?.emailOrUsername || '' }
    });
  }
};

// GET /logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
