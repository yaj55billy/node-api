const handleErrorAsync = function handleErrorAsync(func) {
  /**
   * 先將 async function 帶入參數儲存 (func)
   * 回傳出這個函式，並增加 catch 條件
   * （async 本身就是 promise，所以可用 catch 去捕捉）
   */
  return function (req, res, next) {
    // 
    func(req, res, next).catch(
      function (error) {
        return next(error);
      }
    );
  };
};

module.exports = handleErrorAsync;