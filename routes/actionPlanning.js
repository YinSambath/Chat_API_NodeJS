const router = require("express").Router();
const ActionPlanningController = require("../controllers/action_plannings");
const { verifyAccessToken } = require("../helpers/jwt_helper");

// router.patch("/deleteAll", verifyAccessToken, ActionPlanningController.delete_all);

router.post(
	"/create",
	verifyAccessToken,
	ActionPlanningController.create_action,
);
router.post("/list", verifyAccessToken, ActionPlanningController.list_action);
router.get("/shortToday", verifyAccessToken, ActionPlanningController.short_today);
router.get("/shortAll", verifyAccessToken, ActionPlanningController.short_all);
router.patch(
	"/delete/:actionId",
	verifyAccessToken,
	ActionPlanningController.delete_action,
);
router.put(
	"/update/:actionId",
	verifyAccessToken,
	ActionPlanningController.update_action,
);
router.post("/", verifyAccessToken, ActionPlanningController.search_action);
router.put(
	"/markDone/:actionId",
	verifyAccessToken,
	ActionPlanningController.mark_done,
);
router.put(
	"/reminder/:actionId",
	verifyAccessToken,
	ActionPlanningController.action_reminder,
);
module.exports = router;
