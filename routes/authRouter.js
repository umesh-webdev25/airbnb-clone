const express = require('express');
const authRouter = express.Router();
const controller = require('../controller/login');
const { validateLogin } = require('../middleware/validation');

authRouter.get('/login', controller.login);
authRouter.post('/login', validateLogin, controller.postLogin);

// Logout route - improved with session clearing
authRouter.get('/logout', (req, res) => {
  console.log('Logout route accessed');

  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Internal server error');
    }

    console.log('User logged out successfully');

    // Redirect to home page
    res.redirect('/');
  });
});

module.exports = authRouter;
