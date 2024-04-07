const express = require('express');
const router = express.Router();
const PostsControllers = require('../controllers/posts');

router.get('/posts', PostsControllers.getPosts);
router.post('/post', PostsControllers.createdPost);
router.patch('/post/:id', PostsControllers.editPost);
router.delete('/post/:id', PostsControllers.deletePost);
router.delete('/posts', PostsControllers.deleteAllPosts);

module.exports = router;
