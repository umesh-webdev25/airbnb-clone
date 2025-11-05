# Airbnb Clone Application

A full-stack Airbnb clone built with Node.js, Express, MongoDB, and EJS templating.

## 🚀 Features

- ✅ User authentication (registration & login)
- ✅ **Role-based access control (Admin/User)**
- ✅ Password hashing with bcryptjs
- ✅ Profile image uploads
- ✅ Property listings management
- ✅ Session-based authentication
- ✅ Security middleware (Helmet, Rate Limiting)
- ✅ Input validation
- ✅ Responsive UI with TailwindCSS
- ✅ **Admin Panel for user management**

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd airbnb-clone
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3002
NODE_ENV=development
DB_URL=your-mongodb-connection-string
SESSION_SECRET=your-secret-key-at-least-32-characters
COOKIE_SECURE=false
```

## 🏃‍♂️ Running the Application

### Development mode (with auto-restart):
```bash
npm start
```

### Production mode:
```bash
NODE_ENV=production node App.js
```

The application will be available at `http://localhost:3002`

## 👑 Admin Access

### First User Setup
The **first user** who registers will automatically be assigned the **admin** role and will have access to:
- **Admin Panel** (`/index`) - View and manage all users
- User deletion capabilities
- Full system access

### Making Additional Admins
To promote an existing user to admin:

1. Edit the script `scripts/makeAdmin.js`
2. Update the `USERNAME_OR_EMAIL` constant with the user's username or email
3. Run the script:
```bash
node scripts/makeAdmin.js
```

### Admin vs Regular Users
- **Admin users**: Can access `/index` (user management panel), see all users, delete users
- **Regular users**: Can create listings, view listings, manage their own profile
- The admin panel link (👑 Admin Panel) only appears in the navigation for admin users

## 📁 Project Structure

```
airbnb-clone/
├── controller/          # Request handlers
│   ├── about.js
│   ├── error.js
│   ├── home.js         # User CRUD operations
│   ├── listing.js      # Listing management
│   ├── login.js        # Authentication
│   ├── submit.js
│   └── update.js
├── middleware/          # Custom middleware
│   └── validation.js   # Input validation
├── models/             # Database schemas
│   ├── home.js        # User model
│   └── listing.js     # Listing model
├── routes/            # Route definitions
│   ├── authRouter.js
│   ├── hostRouter.js
│   ├── listingRouter.js
│   └── userRouter.js
├── views/             # EJS templates
│   ├── host/         # Protected pages
│   ├── store/        # Public pages
│   └── partials/     # Reusable components
├── public/           # Static assets
│   ├── home.css
│   └── uploads/      # User uploads
├── util/             # Utility functions
├── App.js            # Main application file
├── .env              # Environment variables (not in git)
├── .env.example      # Example environment file
├── .gitignore        # Git ignore rules
└── package.json      # Dependencies
```

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs with 12 salt rounds
- **Session Security**: HTTP-only cookies with secure flag in production
- **Rate Limiting**: Login attempts limited to 5 per 15 minutes per IP
- **Input Validation**: Server-side validation for all user inputs
- **Security Headers**: Helmet middleware for HTTP header security
- **Environment Variables**: Sensitive data stored in .env file
- **Compression**: Response compression for better performance

## 📝 API Routes

### Public Routes
- `GET /` - Landing page
- `GET /login` - Login page
- `POST /login` - Login authentication
- `GET /logout` - Logout
- `GET /host/about` - About page
- `GET /host/home` - User registration form
- `POST /host/home` - Create user account

### Protected Routes (require authentication)
- `GET /listings` - All property listings
- `GET /listings/new` - Create listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View listing details
- `GET /host/home/:id` - View user details
- `GET /host/editing/:id` - Edit user form
- `POST /host/editing/update` - Update user
- `GET /submit` - Submit page

### Admin-Only Routes (require admin role)
- `GET /index` - **Admin Panel** - View and manage all registered users
- `POST /host/delete/:id` - Delete any user (admin only)

## 🎨 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **View Engine**: EJS
- **Authentication**: express-session
- **Security**: Helmet, bcryptjs, express-rate-limit
- **File Upload**: Multer
- **Validation**: validator.js
- **Styling**: TailwindCSS
- **Dev Tools**: nodemon

## ⚠️ Important Notes

1. **Never commit** the `.env` file to version control
2. Change the `SESSION_SECRET` in production to a strong random string
3. Set `COOKIE_SECURE=true` when using HTTPS in production
4. Update the MongoDB connection string with your credentials
5. Regularly backup your database
6. Monitor upload directory size

## 🐛 Known Issues

- No email verification for new users
- No password reset functionality
- No admin panel
- No search/filter for listings
- No booking/payment system

## 🚧 Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] Advanced search and filters
- [ ] Reviews and ratings system
- [ ] Booking calendar
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Image optimization
- [ ] Cloud storage for uploads (AWS S3/Cloudinary)
- [ ] Pagination for listings
- [ ] User profile pages
- [ ] Real-time notifications

## 📄 License

ISC

## 👨‍💻 Author

Umesh

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email umesh@example.com or create an issue in the repository.

---

Made with ❤️ for learning purposes
