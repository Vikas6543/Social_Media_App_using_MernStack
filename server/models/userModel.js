const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
  },
  email: {
    type: String,
    unique: [true, 'Email already exists'],
    required: [true, 'Email field is required'],
  },
  password: {
    type: String,
    required: [true, 'Password field is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  profilePictureUrl: {
    type: String,
    default:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  },
  post: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// hashing the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// match user password while logging in
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generating a token for the user
userSchema.methods.generateAuthToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_KEY);
};

module.exports = mongoose.model('User', userSchema);
