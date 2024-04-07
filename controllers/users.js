const bcrypt = require('bcryptjs');
const validator = require('validator');
const imageSize = require('image-size');

const User = require('../models/users');
const appError = require('../service/appError');
const handleSuccess = require('../service/handleSuccess');
const handleErrorAsync = require('../service/handleErrorAsync');
const { generateSendJWT } = require('../service/auth');

const usersController = {
  sign_up: handleErrorAsync(async(req, res, next) => {
    /**
     * 欄位是否有填寫
     * 暱稱至少 2 個字元以上
     * Email 格式不正確
     * 密碼需 8 碼以上，且中英混合
     * 帳號已經被註冊，請替換新的 Email
     */
    let { email, password, name } = req.body;

    console.log(password);
  
    if(!email || !password || !name) {
      return next(appError("400", "欄位沒有填寫正確", next));
    }

    if(!validator.isLength(name, {min: 2})) {
      return next(appError("400", "暱稱至少需要 2 個字元以上", next));
    }
  
    if(!validator.isEmail(email)) {
      return next(appError("400", "Email 格式不正確", next));
    }

    if(!validator.isLength(password, {min: 8})){
      return next(appError(400, "密碼不可低於 8 碼", next));
    }
    
    if(validator.isAlpha(password) || validator.isNumeric(password)){
      return next(appError(400, "密碼需英數混合", next));
    }
    
    const existingUser = await User.findOne({ email }); // 資料表中是否存在這個 email
    if(existingUser) {
      return next(appError("400", "帳號已經被註冊，請替換新的 Email", next));
    }
  
    password = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password,
      name
    });
  
    generateSendJWT(newUser, 201, res); // 註冊成功給 token ，表示為登入狀態
  }),

  sign_in: handleErrorAsync(async(req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
      return next(appError("400", "帳號密碼不可為空", next));
    }
  
    const user = await User.findOne({ email }).select('+password'); // select 預設是 false
    if (!user) {
      return next(appError("400", "帳號或密碼錯誤", next)); // 如果找不到使用者
    }

    const auth = await bcrypt.compare(password, user.password); // 輸入的密碼、從資料表撈取的密碼
    if(!auth) {
      return next(appError("400", "帳號或密碼錯誤", next));
    }
  
    generateSendJWT(user, 200, res);
  }),

  profile: handleErrorAsync(async(req, res, next) => {
    handleSuccess(res, req.user);
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    /**
     * 頭貼
     * 暱稱
     * 性別
     * 1.圖片寬高比必需為 1:1，請重新輸入 
     * 2. 解析度寬度至少 300像素以上，請重新輸入
     */
    const { photo, name, gender } = req.body;
    if(!name){
      return next(appError("400", "暱稱", next));
    }
    if(!validator.isLength(name, {min: 2})){
      return next(appError("400", "暱稱最少兩個字元", next));
    }

    // 檢查圖片寬高比
    // const dimensions = imageSize(photo);
    // const aspectRatio = dimensions.width / dimensions.height;
    // if (aspectRatio !== 1) {
    //   return next(appError("400", "圖片寬高比必需為 1:1，請重新輸入", next));
    // }

    // 檢查解析度寬度是否至少 300 像素以上
    // if (dimensions.width < 300) {
    //   return next(appError("400", "解析度寬度至少需要 300 像素以上，請重新輸入", next));
    // }

    const editUser = await User.findByIdAndUpdate(req.user.id, {
      photo,
      name,
      gender
    }, { runValidators: true });
    handleSuccess(res, editUser);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if(password !== confirmPassword) {
      return next(appError(400, "密碼不一致", next));
    }
  
    newPassword = await bcrypt.hash(password, 12);
  
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });
    generateSendJWT(user, 200, res);
  })
}

module.exports = usersController;