const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  photo: String,
  gender: {
    type: String,
    enum: ["male", "female"]
  },
  password: {
    type: String,
    require: [true, '請輸入密碼'],
    minlength: 8,
    selectt: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;