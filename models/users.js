const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      require: [true, '請輸入您的密碼'],
      minlength: 8,
      selectt: false
    },
    photo: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ["male", "female"]
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  { versionKey: false }
);

const User = mongoose.model('user', userSchema);

module.exports = User;