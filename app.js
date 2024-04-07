const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

// 程式出現重大錯誤時，雖然一樣會 app crashed，但能找到錯誤在哪（紀錄在 log）
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
	console.error('Uncaughted Exception！')
	console.error(err); // 會出現在 log 檔案，知道是哪部分程式碼掛掉
	process.exit(1); // 離開應用程式
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

// catch 404 and forward to error handler
// 404 錯誤
app.use(function (req, res, next) {
  res.status(404).json({
    status: 'error',
    message: '無此路由資訊'
  });
});

const resErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    message: error.message,
    error: error,
    stack: error.stack
  });
};

const resErrorProd = (error, res) => {
  if(error.isOperational) {
    res.status(error.statusCode).json({
      message: error.message
    });
  } else {
    console.error('出現重大錯誤', error);

    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請洽系統管理員'
    });
  }
}

// express 錯誤處理，next(Error) 會進到這個錯誤管理中
app.use(function (error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  if(process.env.NODE_ENV === 'dev') {
    return resErrorDev(error, res);
  }

  // production
  if(error.name === 'ValidationError') { // mongoose 錯誤
    error.message = "資料欄位未填寫正確，請重新輸入！";
    error.isOperational = true;
    return resErrorProd(error, res);    
  }
  return resErrorProd(error, res);

});


// 未捕捉到的 promise catch（如果有哪個沒寫到 catch）
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

module.exports = app;
