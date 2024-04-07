const mongoose = require('mongoose'); 

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, '貼文姓名未填寫']
    },
    image: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      required: [true, '貼文內容未填寫']
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    type: {
      type: String,
      enum: ['group','person'], 
      required: [true, '貼文類型 type 未填寫']
    },
    tags: {
      type: [String],
      validate: {
        validator: function(arr) {
          return arr && arr.length > 0 && arr.every(tag => tag.trim() !== '');
        },
        message: '至少需要一個貼文標籤，且不能為空值'
      }
    },
  }, 
  { versionKey: false }
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;