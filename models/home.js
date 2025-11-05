const mongoose = require('mongoose')

const HomeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String, // This will store the file path or URL to the image
    default: null // Allow null for users without a profile image
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Ensure unique indexes exist at the database level as the source of truth
// Note: unique indexes are already created by the schema definition above

module.exports = mongoose.model('Home', HomeSchema);