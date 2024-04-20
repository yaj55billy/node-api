const express = require("express");
const { isAuth } = require("../service/auth");
const uploadImageCheck = require("../service/uploadImageCheck");
const UploadControllers = require("../controllers/upload");
const router = express.Router();

router.post("/file", isAuth, uploadImageCheck, UploadControllers.uploadPhoto);

module.exports = router;
