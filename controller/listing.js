const Listing = require('../models/listing');

exports.renderCreateForm = (req, res) => {
  res.render('host/listing-form', {
    isLoggedIn: req.isLoggedIn,
    values: {},
    errorMessage: null,
  });
};

exports.createListing = async (req, res) => {
  try {
    const rawHome = req.body?.home;
    const rawCountry = req.body?.country;
    const rawCity = req.body?.city;
    const rawPrice = req.body?.price;

    const home = String(rawHome || '').trim();
    const country = String(rawCountry || '').trim();
    const city = String(rawCity || '').trim();
    const price = Number(rawPrice);

    if (!home || !country || !city || Number.isNaN(price)) {
      return res.status(400).render('host/listing-form', {
        isLoggedIn: req.isLoggedIn,
        errorMessage: 'All fields are required and price must be a valid number.',
        values: { home, country, city, price: rawPrice },
      });
    }

    const listing = await Listing.create({ home, country, city, price });
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).render('host/listing-form', {
      isLoggedIn: req.isLoggedIn,
      errorMessage: 'Internal server error. Please try again later.',
      values: req.body || {},
    });
  }
};

exports.listAll = async (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect('/login');
  }
  try {
    const listings = await Listing.find({}).sort({ createdAt: -1 });
    res.render('host/listing-list', {
      isLoggedIn: req.isLoggedIn,
      listings,
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Internal server error');
  }
};

exports.showOne = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.redirect('/listings');
    }
    res.render('host/listing-detail', {
      isLoggedIn: req.isLoggedIn,
      listing,
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).send('Internal server error');
  }
};

// New: Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).send('Internal server error');
  }
};

// New: Edit a listing
exports.editListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { home, country, city, price } = req.body;

    if (!home || !country || !city || Number.isNaN(Number(price))) {
      return res.status(400).send('Invalid input data');
    }

    await Listing.findByIdAndUpdate(id, { home, country, city, price });
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error('Error editing listing:', error);
    res.status(500).send('Internal server error');
  }
};


