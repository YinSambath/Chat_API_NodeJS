const router = require("express").Router();
const ActionTripController = require("../controllers/actionTrips");
const { verifyAccessToken } = require("../helpers/jwt_helper");

// router.patch("/deleteAll", verifyAccessToken, ActionTripController.delete_all);

router.post("/create", verifyAccessToken, ActionTripController.create_action);
router.post("/list", verifyAccessToken, ActionTripController.list_action);
router.get("/shortToday", verifyAccessToken, ActionTripController.short_today);
router.get("/shortAll", verifyAccessToken, ActionTripController.short_all);
router.patch(
	"/delete/:actionId",
	verifyAccessToken,
	ActionTripController.delete_action,
);
router.put(
	"/update/:actionId",
	verifyAccessToken,
	ActionTripController.update_action,
);

router.post("/", verifyAccessToken, ActionTripController.search_action);
router.put(
	"/markDone/:actionId",
	verifyAccessToken,
	ActionTripController.mark_done,
);
router.put(
	"/reminder/:actionId",
	verifyAccessToken,
	ActionTripController.action_reminder,
);

module.exports = router;
