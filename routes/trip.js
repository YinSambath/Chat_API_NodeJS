const mongoose = require("mongoose");
const router = require("express").Router();
const TripController = require("../controllers/trips");
const Trip = mongoose.model("Trip");
const { verifyAccessToken } = require("../helpers/jwt_helper");

router.post("/create", verifyAccessToken, TripController.create_trip);
router.get("/list", verifyAccessToken, TripController.list_trip);
router.get("/:tripId", verifyAccessToken, TripController.view_trip);
router.patch("/delete/:tripId", verifyAccessToken, TripController.delete_trip);
router.put("/update/:tripId", verifyAccessToken, TripController.update_trip);
router.get("/", verifyAccessToken, TripController.search_trip);
router.put(
	"/reminder/:tripId",
	verifyAccessToken,
	TripController.trip_reminder,
);
router.post("/addUser/:tripId", verifyAccessToken, TripController.add_user);
module.exports = router;
