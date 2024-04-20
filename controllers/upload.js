const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const User = require("../models/users");

const sizeOf = require("image-size");
const { v4: uuidv4 } = require("uuid");
const firebaseAdmin = require("../service/firebase");
const bucket = firebaseAdmin.storage().bucket();

const uploadControllers = {
	uploadPhoto: handleErrorAsync(async (req, res, next) => {
		if (!req.files.length) {
			return next(appError(400, "尚未上傳檔案", next));
		}

		const file = req.files[0];

		const dimensions = sizeOf(file.buffer);
		const aspectRatioThreshold = 0.05;
		const aspectRatioDiff = Math.abs(dimensions.width / dimensions.height - 1);
		if (aspectRatioDiff > aspectRatioThreshold) {
			return next(appError(400, "圖片寬高比必需趨近於 1:1，請重新上傳圖片！"));
		}

		const blob = bucket.file(
			`images/${uuidv4()}.${file.originalname.split(".").pop()}`
		);
		const blobStream = blob.createWriteStream();

		// 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
		blobStream.on("finish", () => {
			const config = {
				action: "read", // 權限
				expires: "12-31-2500", // 網址的有效期限
			};
			blob.getSignedUrl(config, (err, fileUrl) => {
				res.send({
					fileUrl,
				});
			});
		});

		// 如果上傳過程中發生錯誤，會觸發 error 事件
		blobStream.on("error", (error) => {
			const parsedError = JSON.parse(error.message);
			const errorMessage = parsedError.error.message;
			errorMessage ? errorMessage : "發生未知錯誤，請稍候再嘗試！";
			res.status(500).json({
				status: "error",
				message: errorMessage,
			});
		});

		blobStream.end(file.buffer);
	}),
};

module.exports = uploadControllers;
