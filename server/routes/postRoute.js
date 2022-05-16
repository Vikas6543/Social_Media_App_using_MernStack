const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();
const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const cloudinary = require('cloudinary');

// Create a post
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;

    // check if caption & is provided
    if (!caption || !imageUrl) {
      return res.status(400).json({
        message: 'Caption and image are required',
      });
    }

    // cloudinary
    const cloud = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: 'Mern-social',
      public_id: Date.now(),
    });

    // create a new post
    const newPost = new postModel({
      caption,
      imageUrl: cloud.secure_url,
      owner: req.user._id,
    });

    // save post
    const savedPost = await newPost.save();

    // find logged in user
    const user = await userModel.findById(req.user._id);

    // add savedpost to user post model
    user.post.push(savedPost._id);

    await user.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: savedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Like & Unlike a post
router.get('/likeUnlike/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    // check if post doesn't exist
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // check if likes exists in post by user
    if (post.likes.includes(req.user._id)) {
      // unlike post if user already liked it
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({
        message: 'Post unliked successfully',
        post,
      });
    } else {
      // like post if user hasn't liked it
      post.likes.push(req.user._id);
      await post.save();
      res.status(200).json({
        message: 'Post liked successfully',
        post,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Comment on a post
router.post('/comment/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    // check if post doesn't exist
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // check if comment exists in post by user
    const postExists = post.comments.find(
      (comment) => comment.user.toString() === req.user._id.toString()
    );

    if (postExists) {
      // update comment if user already commented on it
      const index = post.comments.findIndex(
        (comment) => comment.user.toString() === req.user._id.toString()
      );
      post.comments[index].comment = req.body.comment;
      await post.save();
      return res.status(200).json({
        message: 'Comment updated successfully',
      });
    } else {
      // comment on post if user hasn't commented on it
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });
      await post.save();
      res.status(200).json({
        message: 'Comment added successfully',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete a post
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    // check if post doesn't exist
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // check if user is owner of post
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'You are not authorized to delete this post',
      });
    }

    // delete post if user is owner
    await post.remove();

    // find logged in user
    const user = await userModel.findById(req.user._id);

    // remove post from user post model
    const index = user.post.indexOf(req.params.id);
    user.post.splice(index, 1);
    await user.save();
    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Delete a comment
router.delete('/comment/:id', isAuthenticated, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    // check if post doesn't exist
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // check if comment exists in post by user
    const postExists = post.comments.find(
      (comment) => comment.user.toString() === req.user._id.toString()
    );

    if (!postExists) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    // delete comment if user is owner
    const index = post.comments.findIndex(
      (comment) => comment.user.toString() === req.user._id.toString()
    );
    post.comments.splice(index, 1);
    await post.save();
    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get recent posts
router.get('/recent', isAuthenticated, async (req, res) => {
  try {
    const posts = await postModel.find().populate('owner').sort({
      createdAt: -1,
    });
    res.status(200).json({
      message: 'Recent posts fetched successfully',
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
