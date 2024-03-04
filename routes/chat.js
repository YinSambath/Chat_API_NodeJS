const router = require("express").Router();
const ChatController = require("../controllers/chat_controller");
const { verifyAccessToken } = require("../helpers/jwt_helper");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../uploads"));
	},
	filename: function (req, file, cb) {
		cb(
			null,
			new Date().toISOString().replace(/:/g, "-") +
				"-" +
				file.originalname,
		);
	},
});
const upload = multer({
	storage: storage,
	limit: {
		fileSize: 1024 * 1024 * 5,
	},
});

router.post("/create-chat", verifyAccessToken, ChatController.create_chat);
router.get("/list-chat",verifyAccessToken, ChatController.list_chat);
router.get("/private-chat/:person2Id", verifyAccessToken, ChatController.get_chat);
router.post(
	"/sendimage",
	verifyAccessToken,
	upload.single("image"),
	ChatController.send_image,
);

module.exports = router;