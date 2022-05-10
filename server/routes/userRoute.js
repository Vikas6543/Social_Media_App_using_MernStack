const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
const cloudinary = require('cloudinary');

// Register a user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, profilePictureUrl } = req.body;
    let user = await userModel.findOne({ email });

    // Check if user already exists
    if (user) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    // cloudinary
    // const cloud = await cloudinary.v2.uploader.upload(profilePictureUrl, {
    //   folder: 'Mern-social',
    // });

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password,
      profilePictureUrl,
    });

    // save user to database
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User Registered successfully',
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    // Check if password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Incorrect password',
      });
    }

    // Generate token
    const token = await user.generateAuthToken();

    // token options
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // Set cookie & response
    res.status(200).cookie('token', token, options).json({
      message: 'User logged in successfully',
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Logout a user
router.get('/logout', async (req, res) => {
  try {
    // remove cookie token
    res
      .status(200)
      .cookie('token', '', { expires: new Date(Date.now()), httpOnly: true })
      .json({
        message: 'User logged out successfully',
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update a password
router.get('/updatePassword', isAuthenticated, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user._id).select('+password');

    // Check if password is correct
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Old Password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update a profile
router.get('/updateProfile', isAuthenticated, async (req, res) => {
  try {
    const { name, email, profilePictureUrl } = req.body;
    const user = await userModel.findById(req.user._id);

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    if (profilePictureUrl) {
      user.profilePictureUrl = profilePictureUrl;
    }

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    res.save(500).json({
      message: error.message,
    });
  }
});

// Delete an account
router.delete('/deleteAccount', isAuthenticated, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const usersPosts = user.post;
    const usersFollowers = user.followers;
    const usersFollowing = user.following;
    const user_Id = user._id;

    // Delete user account
    await user.remove();

    // also Delete all posts of user
    for (let post of usersPosts) {
      const modelPosts = await postModel.findById(post);
      await modelPosts.remove();
    }

    // removing user from followers and following
    for (let follower of usersFollowers) {
      const userFollower = await userModel.findById(follower);
      const followerIndex = userFollower.following.indexOf(user_Id);
      userFollower.following.splice(followerIndex, 1);
      await userFollower.save();
    }

    for (let following of usersFollowing) {
      const userFollowing = await userModel.findById(following);
      const followingIndex = userFollowing.followers.indexOf(user_Id);
      userFollowing.followers.splice(followingIndex, 1);
      await userFollowing.save();
    }

    // remove cookie token
    res.cookie('token', '', { expires: new Date(Date.now()), httpOnly: true });

    res.status(200).json({
      message: 'User account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get my profile
router.get('/myProfile', isAuthenticated, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate('post followers following');

    res.status(200).json({
      message: 'User profile fetched successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get other user profile
router.get('/userProfile/:id', async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .populate('post followers following');

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    res.status(200).json({
      message: 'User profile fetched successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Follow & Unfollow a user
router.get('/followUnfollow/:id', isAuthenticated, async (req, res) => {
  try {
    const userToFollow = await userModel.findById(req.params.id);
    const loggedInUser = await userModel.findById(req.user._id);

    // Check if user exists
    if (!userToFollow) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    // Check if user is already followed
    if (loggedInUser.following.includes(userToFollow._id)) {
      // Remove user from following list
      const followingIndex = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(followingIndex, 1);

      // Remove logged in user from followers list
      const followerIndex = userToFollow.followers.indexOf(loggedInUser._id);
      userToFollow.followers.splice(followerIndex, 1);

      await userToFollow.save();
      await loggedInUser.save();

      res.status(200).json({
        message: 'User Unfollowed successfully',
      });
    } else {
      // following
      loggedInUser.following.push(userToFollow._id);

      // followers
      userToFollow.followers.push(loggedInUser._id);

      // save user to database
      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        message: 'User followed successfully',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get all posts of following users
router.get('/getFollowingPosts', isAuthenticated, async (req, res) => {
  try {
    const loggedInUser = await userModel.findById(req.user._id);

    // get all posts of following users
    const posts = await userModel
      .find({
        _id: { $in: loggedInUser.following },
      })
      .populate('post')
      .select('post');

    res.status(200).json({
      message: 'Following posts fetched successfully',
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
