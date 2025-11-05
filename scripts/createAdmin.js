/**
 * Create Admin Account Script
 * 
 * This script creates a new admin user with predefined credentials.
 * 
 * Usage: node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Home = require('../models/home');

// ADMIN CREDENTIALS - CONFIGURE THESE:
const ADMIN_CONFIG = {
  name: 'Admin',
  username: 'admin',
  email: 'admin@10.com',
  password: 'admin@123', // Change this to a secure password
  profileImage: null
};

async function createAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Home.findOne({
      $or: [
        { username: ADMIN_CONFIG.username },
        { email: ADMIN_CONFIG.email }
      ]
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      
      // If exists but not admin, promote to admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ User promoted to admin role!');
      }
      
      await mongoose.connection.close();
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, saltRounds);

    // Create admin user
    const admin = await Home.create({
      name: ADMIN_CONFIG.name,
      username: ADMIN_CONFIG.username,
      email: ADMIN_CONFIG.email.toLowerCase(),
      password: hashedPassword,
      profileImage: ADMIN_CONFIG.profileImage,
      role: 'admin'
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('📋 Admin Credentials:');
    console.log('═══════════════════════════════════════');
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${ADMIN_CONFIG.password}`);
    console.log(`   Role:     ${admin.role}`);
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    console.log('🔗 Login at: http://localhost:3002/login\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();
