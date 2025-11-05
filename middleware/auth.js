// Middleware to check if user is logged in
exports.requireAuth = (req, res, next) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};

// Middleware to check if user is admin
exports.requireAdmin = (req, res, next) => {
  // Check if user is logged in
  if (!req.session || !req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  // Check if user has admin role
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('404page', {
      isLoggedIn: req.isLoggedIn,
      errorMessage: 'Access Denied: Admin privileges required'
    });
  }

  next();
};

// Middleware to attach user info to request
exports.attachUser = (req, res, next) => {
  if (req.session && req.session.user) {
    // Normalize session user shape: some places expect `_id` while login stored `id`.
    const sessionUser = req.session.user;
    const normalizedUser = Object.assign({}, sessionUser, {
      _id: sessionUser._id || sessionUser.id || sessionUser._id
    });

    req.user = normalizedUser;
    res.locals.user = normalizedUser;
    res.locals.isAdmin = normalizedUser.role === 'admin';
  } else {
    res.locals.isAdmin = false;
  }
  next();
};
