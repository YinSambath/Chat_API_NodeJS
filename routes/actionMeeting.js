const router = require("express").Router();
const ActionController = require("../controllers/action_meetings");
const { verifyAccessToken } = require("../helpers/jwt_helper");

// router.patch("/deleteAll", verifyAccessToken, ActionController.delete_all);

router.post("/create", verifyAccessToken, ActionController.create_action);
router.post("/list", verifyAccessToken, ActionController.list_action);
router.get("/shortToday", verifyAccessToken, ActionController.short_today);
router.get("/shortAll", verifyAccessToken, ActionController.short_all);
router.patch(
	"/delete/:actionId",
	verifyAccessToken,
	ActionController.delete_action,
);
router.put(
	"/update/:actionId",
	verifyAccessToken,
	ActionController.update_action,
);
router.post("/", verifyAccessToken, ActionController.search_action);
router.put(
	"/markDone/:actionId",
	verifyAccessToken,
	ActionController.mark_done,
);
router.put(
	"/reminder/:actionId",
	verifyAccessToken,
	ActionController.action_reminder,
);
module.exports = router;
