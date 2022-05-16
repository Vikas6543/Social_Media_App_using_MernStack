const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const cors = require('cors');
const dotenv = require('dotenv');

// dotenv initilization
dotenv.config({
  path: './config/.env',
});

// connect to database
connectDatabase();

cloudinary;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// using middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors());

// using routes
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/post', require('./routes/postRoute'));

// listening port
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
