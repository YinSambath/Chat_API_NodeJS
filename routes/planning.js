const mongoose = require("mongoose");
const router = require("express").Router();
const PlanningController = require("../controllers/plannings");
const { verifyAccessToken } = require("../helpers/jwt_helper");

router.post("/create", verifyAccessToken, PlanningController.create_planning);
router.get("/list", verifyAccessToken, PlanningController.list_planning);
router.get("/:planningId", verifyAccessToken, PlanningController.view_planning);
router.patch(
	"/delete/:planningId",
	verifyAccessToken,
	PlanningController.delete_planning,
);
router.put(
	"/update/:planningId",
	verifyAccessToken,
	PlanningController.update_planning,
);
router.get("/", verifyAccessToken, PlanningController.search_planning);
router.put(
	"/reminder/:planningId",
	verifyAccessToken,
	PlanningController.planning_reminder,
);
router.post("/addUser/:planningId", verifyAccessToken, PlanningController.add_user);
module.exports = router;
