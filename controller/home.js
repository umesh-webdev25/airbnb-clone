// controllers/home.js
const Home = require('../models/home');
const Listing = require('../models/listing');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Export multer middleware for use in routes
exports.upload = upload;

// This function doesn't need to be async as it does no async work
exports.index = (req, res) => {
  res.render('store/index', { isLoggedIn: true });
}

exports.showdetail = (req, res, next) => {
  res.render('host/home', {
    editing: false,
    isLoggedIn: true // Assuming you want to show the home page with editing disabled
  });
}


exports.adddetails = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if all required fields are present
    if (!name || !username || !email || !password) {
      return res.status(400).render('host/home', {
        editing: false,
        errorMessage: 'All fields are required',
        isLoggedIn: true
      });
    }

    // Check for duplicate email or username
    const existingUser = await Home.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }]
    });

    if (existingUser) {
      return res.status(409).render('host/home', {
        editing: false,
        errorMessage: 'User already exists with same email or username.'
      });
    }

    // Handle profile image
    let profileImagePath = null;
    if (req.file) {
      profileImagePath = '/uploads/' + req.file.filename;
    }

    // Hash password before saving
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if this is the first user (make them admin)
    const userCount = await Home.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    await Home.create({
      name: name.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      profileImage: profileImagePath,
      role: role
    });

    console.log(`✅ User created with role: ${role}`);
    res.render('host/successfull');
  } catch (error) {
    console.error('Error in adddetails:', error);

    // Handle multer errors specifically
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).render('host/home', {
          editing: false,
          errorMessage: 'File too large. Maximum size is 5MB.'
        });
      }
    }

    // Handle file filter errors
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).render('host/home', {
        editing: false,
        errorMessage: 'Only image files are allowed!'
      });
    }

    res.status(500).render('host/home', {
      editing: false,
      errorMessage: 'Internal server error'
    });
  }
};

exports.addhome = async (req, res) => {
  try {
    const users = await Home.find();
    res.render('store/addhome', {
      Registration: users,
      editing: false,
      isLoggedIn: true // Assuming you want to show the add home page
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal server error');
  }
}

exports.editing = async (req, res, next) => {
  const id = req.params.id;
  const isEditing = req.query.editing === 'true';

  try {
    const user = await Home.findById(id);
    // Check if a user was found before rendering
    if (!user) {
      console.log('User not found for editing');
      return res.redirect('/');
    }

    // Render the page with the found user data
    res.render('host/home', {
      user: user,
      editing: isEditing,
      isLoggedIn: true
    });
  } catch (err) {
    // Handle any errors from the database query
    console.error('Error fetching user for editing:', err);
    res.status(500).send('<h1>Error loading user details.</h1>');
  }
}

// controller/home.js
exports.update = async (req, res) => {
  try {
    const { id, name, username, email, password, removeImage } = req.body;

    if (!id || !name || !username || !email || !password) {
      return res.status(400).send('All fields are required for update');
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim()
    };

    // Only hash and update password if it's been changed
    // Check if password is different from stored hash
    const user = await Home.findById(id);
    if (user && password !== user.password) {
      // Password has been changed, hash it
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(password, saltRounds);
    } else {
      // Keep existing password
      updateData.password = password;
    }

    // Handle profile image
    if (req.file) {
      // New image uploaded
      updateData.profileImage = '/uploads/' + req.file.filename;
    } else if (removeImage === 'true') {
      // Image should be removed
      updateData.profileImage = null;
    }
    // If no file uploaded and removeImage is not true, keep existing image

    const updatedUser = await Home.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    // Redirect to the user list page
    res.redirect('/host/update');
  } catch (error) {
    console.error('Error updating user:', error);

    // Handle multer errors specifically
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).render('host/home', {
          editing: true,
          errorMessage: 'File too large. Maximum size is 5MB.',
          user: req.body
        });
      }
    }

    // Handle file filter errors
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).render('host/home', {
        editing: true,
        errorMessage: 'Only image files are allowed!',
        user: req.body
      });
    }

    res.status(500).send('Internal server error');
  }
};

exports.showdetailbyid = async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch the user and their listings (listings are stored in the Listing collection)
    const user = await Home.findById(id).lean();
    const listings = await Listing.find({ owner: id }).sort({ createdAt: -1 }).lean();

    if (user) {
      // Attach the user's listings to the user object for the template
      user.listings = listings;
    }

    if (!user) {
      console.log('User not found');
      return res.redirect('/');
    }

    // Pass both `user` (for single-user detail branch) and `Registration` (for existing grid branch)
    res.render('host/detail', { user: user, Registration: [user], isLoggedIn: true });
  } catch (err) {
    // This catches any errors from the database and prevents a crash
    console.error('Error fetching user details:', err);
    res
      .status(500)
      .send('<h1>Error loading user details. Please try again later.</h1>');
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await Home.findByIdAndDelete(id);

    if (!deletedUser) {
      console.error(`User with ID ${id} not found for deletion.`);
      return res.status(404).send('User not found');
    }

    console.log(`Deleted user with ID: ${id}`);
    res.redirect('/index'); // Redirect to the host home page after deletion
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal server error');
  }
};