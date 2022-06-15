const router = require("express").Router();
const FolderController = require("../controllers/folder_todos");
const { verifyAccessToken } = require("../helpers/jwt_helper");

router.post("/createFolder", verifyAccessToken, FolderController.create_folder);
router.get("/listFolder", verifyAccessToken, FolderController.list_folder);
router.patch(
	"/delete/:folderId",
	verifyAccessToken,
	FolderController.delete_folder,
);
router.put("/update/:folderId", FolderController.update_folder);
router.get("/", verifyAccessToken, FolderController.search_folder);

module.exports = router;
