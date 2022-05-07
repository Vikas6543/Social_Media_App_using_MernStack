const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const connectDatabase = require('./config/database');

// dotenv
require('dotenv').config({
  path: './config/.env',
});

// connect to database
connectDatabase();

// using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// import routes
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');

// using routes
app.use('/api/post', postRoute);
app.use('/api/user', userRoute);

// listening port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
