const handleSuccess = require('../service/handleSuccess');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const Post = require("../models/posts");
const User = require("../models/users");

const postController = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    // asc 從舊到新
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};

    // populate 表示要找 id 資訊，然後這個 id 有關聯到其他資料表
    const allPosts = await Post.find(q).populate({
      path: 'user',
      select: 'name photo '
    }).sort(timeSort);

    handleSuccess(res, allPosts);
  }),
  createdPost: handleErrorAsync(async (req, res, next) => {
    const data = req.body;

    if(data.content !== undefined) {
      const newPost = await Post.create({
        user: data.user,
        image: data.image,
        content: data.content,
        type: data.type,
        tags: data.tags
      });    
      handleSuccess(res, newPost);
    } else {
      return next(appError(400, "尚未填寫 content 資料", next));
    }
  }),
  editPost: handleErrorAsync(async (req, res, next) => {
    const data = req.body;
    const id = req.params.id;

    if(data.content !== undefined) {
      const editContent = {
        name: data.name,
        image: data.image,
        content: data.content,
        type: data.type,
        tags: data.tags
      };     
      const editPost = await Post.findByIdAndUpdate(id, editContent, { returnDocument: 'after' });
      if(editPost !== null){
        handleSuccess(res, editPost);
      }else{
        return next(appError(400, "找不到貼文！", next))
      } 
    } else {
      return next(appError(400, "尚未填寫 content 資料", next));
    }
  }),
  deletePost: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const deletePost = await Post.findByIdAndDelete(id);
    if(deletePost !== null) {
      handleSuccess(res, null);  
    } else {
      return next(appError(400, "找不到貼文！", next));
    }
  }),
  deleteAllPosts: handleErrorAsync(async (req, res, next) => {
    const posts = await Post.deleteMany({}); 
    handleSuccess(res, posts);
  }),
}

module.exports = postController;