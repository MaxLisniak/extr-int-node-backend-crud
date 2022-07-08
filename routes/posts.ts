const express = require('express');
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/Posts');
const router = express.Router();

// get the posts 
router.get(
    '/posts', 
    getPosts,
);

// send a new post
router.post(
    '/posts', 
    createPost,
);
  
// update a post by id
router.put(
    '/posts/:id', 
    updatePost,
);

// delete post by id
router.delete(
    '/posts/:id', 
    deletePost
);

module.exports = router;
export {}