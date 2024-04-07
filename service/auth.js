const jwt = require('jsonwebtoken');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const User = require('../models/users');

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token) {
    next(appError(401, 'Oops..您尚未登入', next));
  }

  // 驗證 token 正確與否
  const decoded = await new Promise((resolve, reject) => {
    // 前端傳來的 token, JWT_SECRET 環境變數
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
      if(error) {
        reject(error);
      } else {
        resolve(payload);
      }
    })
  });

  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;

  next();
});

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT
  // sign 簽出一個憑證（餐廳號碼牌概念）
  // 第一個參數：要放什麼資訊
  // 第二個參數：加鹽混淆
  // 第三個參數：過期時間
  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    user: {
      token,
      name: user.name
    }
  })
}

module.exports = {
  isAuth,
  generateSendJWT
}