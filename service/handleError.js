const handleError = (res, error) => {
  let message = '';
  if (error) {
    message = error.message;
  } else {
    message = "欄位未填寫正確或無此 id";
  }

  res.status(400).json({
    "status": "false",
    message
  });
  res.end();
}
module.exports = handleError;