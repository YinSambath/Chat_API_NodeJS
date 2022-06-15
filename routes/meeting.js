const mongoose = require("mongoose");
const router = require("express").Router();
const MeetingController = require("../controllers/meetings");
const { verifyAccessToken } = require("../helpers/jwt_helper");

router.post("/create", verifyAccessToken, MeetingController.create_meeting);
router.get("/list", verifyAccessToken, MeetingController.list_meeting);
router.get("/:meetingId", verifyAccessToken, MeetingController.view_meeting);
router.patch(
	"/delete/:meetingId",
	verifyAccessToken,
	MeetingController.delete_meeting,
);
router.put(
	"/update/:meetingId",
	verifyAccessToken,
	MeetingController.update_meeting,
);
router.get("/", verifyAccessToken, MeetingController.search_meeting);
router.put(
	"/reminder/:meetingId",
	verifyAccessToken,
	MeetingController.meeting_reminder,
);
router.post("/addUser/:meetingId", verifyAccessToken, MeetingController.add_user);
module.exports = router;
