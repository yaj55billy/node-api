const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const { resErrorDev, resErrorProd } = require('./service/handleResponseError');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

/**
  * 程式出現重大錯誤 app crashed
  * 將錯誤記錄在 log 上，得知是哪個部分掛掉 
*/
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！');
  console.error(err); 
  process.exit(1);
});

require("./connections"); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api', postsRouter);
app.use('/api/users', usersRouter);

// catch 404
app.use(function (req, res, next) {
  res.status(404).json({
    status: 'error',
    message: '無此 API 路徑'
  });
});

/**
  * next(Error) 錯誤管理
  * 開發環境會回傳完整的錯誤訊息；生產環境時，則回傳簡單的錯誤訊息
*/
app.use(function (error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  if(process.env.NODE_ENV === 'dev') {
    return resErrorDev(error, res);
  }

  if(error.name === 'ValidationError') { 
    // mongoose 錯誤
    error.message = "資料欄位未填寫正確，請重新輸入！";
    error.isOperational = true;
    return resErrorProd(error, res);    
  }
  return resErrorProd(error, res);
});


// 未捕捉到的 promise catch（沒寫到 catch）
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
});

module.exports = app;
