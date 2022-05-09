const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');
const cors = require('cors');
const http = require('http');

// dotenv initilization
require('dotenv').config({
  path: './config/.env',
});

// connect to database
connectDatabase();

// cloudinary
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

// using socket
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.emit('message', 'Hello Vikas');
});

// listening port
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
