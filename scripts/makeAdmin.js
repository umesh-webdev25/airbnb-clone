/**
 * Admin Setup Script
 * 
 * This script helps you manually promote a user to admin role.
 * 
 * Usage:
 * 1. Update the USERNAME_OR_EMAIL constant below
 * 2. Run: node scripts/makeAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Home = require('../models/home');

// CONFIGURE THIS:
const USERNAME_OR_EMAIL = 'your-username-or-email-here';

async function makeAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Connected to MongoDB');

    // Find user
    const user = await Home.findOne({
      $or: [
        { username: USERNAME_OR_EMAIL },
        { email: USERNAME_OR_EMAIL.toLowerCase() }
      ]
    });

    if (!user) {
      console.error('❌ User not found:', USERNAME_OR_EMAIL);
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log('ℹ️  User is already an admin:', user.username);
      process.exit(0);
    }

    // Update to admin
    user.role = 'admin';
    await user.save();

    console.log('✅ Successfully promoted user to admin:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Validate configuration
if (USERNAME_OR_EMAIL === 'your-username-or-email-here') {
  console.error('❌ Please configure USERNAME_OR_EMAIL in the script first!');
  process.exit(1);
}

makeAdmin();
