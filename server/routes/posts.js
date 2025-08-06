const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = new Post({
      content: content.trim(),
      author: req.user._id
    });

    await post.save();
    await post.populate('author', 'name email');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Get posts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 });
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts' });
  }
});

module.exports = router;