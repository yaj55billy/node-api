const express = require("express");
const { isAuth } = require("../service/auth");
const router = express.Router();
const PostsControllers = require("../controllers/posts");

router.get("/posts", isAuth, PostsControllers.getPosts);
router.post("/post", isAuth, PostsControllers.createdPost);
router.patch("/post/:id", PostsControllers.editPost);
router.delete("/post/:id", PostsControllers.deletePost);
router.delete("/posts", PostsControllers.deleteAllPosts);

module.exports = router;
