const express = require('express');
const listingController = require('../controller/listing');
const { validateListing } = require('../middleware/validation');

const router = express.Router();

// Middleware to check login status
const ensureLoggedIn = (req, res, next) => {
  if (!req.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};

// Create
router.get('/listings/new', ensureLoggedIn, listingController.renderCreateForm);
router.post('/listings', ensureLoggedIn, validateListing, listingController.createListing);

// Read
router.get('/listings', ensureLoggedIn, listingController.listAll);
router.get('/listings/:id', ensureLoggedIn, listingController.showOne);

module.exports = router;


