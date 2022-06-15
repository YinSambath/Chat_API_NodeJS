const router = require("express").Router();
const ContactController = require("../controllers/contacts");
const { verifyAccessToken } = require("../helpers/jwt_helper");

router.post("/create", verifyAccessToken, ContactController.create_contact);
router.get("/list", verifyAccessToken, ContactController.list_contact);
router.get("/:contactId", verifyAccessToken, ContactController.view_contact);
router.patch(
	"/delete/:contactId",
	verifyAccessToken,
	ContactController.delete_contact,
);
router.put(
	"/update/:contactId",
	verifyAccessToken,
	ContactController.update_contact,
);
router.get("/", verifyAccessToken, ContactController.search_contact);

module.exports = router;
