function handleSuccess (res, data) {
  res.status(200).json({
    "status": "success",
    "data": data
  });
  res.end();
}
module.exports = handleSuccess;