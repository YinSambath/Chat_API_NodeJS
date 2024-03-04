const router = require("express").Router();
const UserController = require("../controllers/users");
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
router.get("/list", UserController.list_user);
router.post("/register", UserController.user_register);
router.post("/login", UserController.user_login);
router.delete("/logout", verifyAccessToken, UserController.user_logout);
router.get("/profile/:userId", verifyAccessToken, UserController.user_profile);
router.post(
	"/renewAccessToken",
	verifyAccessToken,
	UserController.generateNewAccessToken,
);
router.patch("/update/:userId", verifyAccessToken, UserController.update_user);
router.patch("/renewPassword", UserController.renew_password);
router.patch(
	"/changePassword",
	verifyAccessToken,
	UserController.change_password,
);
router.put("/checkedPhone", UserController.check_phone);
router.post(
	"/uploadOrUpdate/:userId",
	verifyAccessToken,
	upload.single("newProfile"),
	UserController.upload_update_profile,
);
module.exports = router;
