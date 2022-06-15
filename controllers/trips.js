const Trip = require("../models/trip");
const Action = require("../models/ActionTrip");
const moment = require("moment");
const { createTripValidation } = require("../validations/validation");
const Contact = require("../models/Contact");

exports.create_trip = async (req, res) => {
	const { error } = createTripValidation(req.body);
	if (error) {
		return res.status(400).json({ error: error });
	}
	const trip = new Trip({
		title: req.body.title,
		note: req.body.note,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		lat: req.body.lat,
		lng: req.body.lng,
		location: req.body.location,
		reminder: req.body.reminder,
		progress: req.body.progress,
		userId: req.user.userId,
	});
	try {
		const newTrip = await trip.save();
		return res.status(200).json({ data: newTrip });
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};
exports.list_trip = async (req, res) => {
	const userId = req.user.userId;
	try {
		const trips = await Trip.paginate(
			{ userId: userId },
			{
				page: req.query.page == null ? 1 : req.query.page,
				limit: req.query.limit == null ? 10 : req.query.limit,
				sort: {_id:-1}
			},
		);
		if (trips != null) {
			return res.status(200).json({ data: trips });
		}
	} catch (err) {
		return res.status(500).json({
			error: err.message,
		});
	}
};
exports.view_trip = async (req, res) => {
	const tripId = req.params.tripId;
	const trip = await Trip.findById(tripId);
	if (!trip) {
		return res.status(404).json({ error: "Not found!!!" });
	} else {
		return res.status(200).json({ trip });
	}
};
exports.delete_trip = async (req, res) => {
	try {
		const tripId = req.params.tripId;
		const trip = await Trip.findById(tripId);
		if (trip) {
			const removetrip = await Trip.deleteOne({_id: tripId});
			const deleteAction = await Action.deleteMany({ tripId: tripId });
			if (removetrip && deleteAction) {
				return res.status(200).json({ message: "trip has been delete." , data: removetrip});
			} else {
				return res.json("something went wrong!");
			}
		} else {
			return res.status(400).json({
				error: "Somthing went wrong!!!",
			});
		}
	} catch (err) {
		res.status(500).json({
			error: err.message,
		});
	}
};
exports.update_trip = async (req, res) => {
	try {
		const tripId = req.params.tripId;
		const updateInfo = req.body;
		const options = { new: true };
		const checkTrip = await Trip.findById(tripId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkTrip) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await Trip.findByIdAndUpdate(
				tripId,
				updateInfo,
				options,
			);
			if (updatedInfo) {
				const trip = await Trip.findByIdAndUpdate(
					tripId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: trip,
				});
			} else {
				return res.status(500).json({ error: "something went wrong" });
			}
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.search_trip = async (req, res) => {
	const search = req.query.search;
	const userId = req.user.userId;

	const filter = await Trip.paginate(
		{
			userId: req.user.userId,
			$or: [
				{
					title: { $regex: new RegExp(search) },
				},
			],
		},
		{
			page: req.query.page == null ? 1 : req.query.page,
			limit: req.query.limit == null ? 10 : req.query.limit,
		},
		{
			__v: 0,
		},
	);
	if (filter) {
		return res.status(200).json({ data: filter });
	}
};
exports.trip_reminder = async (req, res) => {
	try {
		const tripId = req.params.tripId;
		const reminder = req.body.reminder;
		const options = { new: true };
		const checkTrip = await Trip.findById(tripId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkTrip) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await Trip.findByIdAndUpdate(
				tripId,
				{ reminder: reminder },
				options,
			);
			if (updatedInfo) {
				const trip = await Trip.findByIdAndUpdate(
					tripId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: trip,
				});
			} else {
				return res.status(500).json({ error: "something went wrong" });
			}
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.add_user = async (req, res) => {
	const tripId = req.params.tripId;
	const userId = req.body.user;
	const options = {new: true};
	const userData = [];
	console.log(userId);
	for(i=0; i<userId.length; i++) {
		const memberInfo = await Contact.findById(userId[i]);
		console.log(memberInfo);
		userData.push(memberInfo);
	}
	console.log("Data: ", userData);
	const checkTrip = await Trip.findByIdAndUpdate(tripId,{contact: userData, member: userData.length}, options);
	if (!checkTrip) {
		return res.status(404).json({
			message: " Trip not found"
		});
	}
	// checkTrip.member = checkTrip.user.length;
	const newData = await checkTrip.save();
	return res.status(200).json({
		data: newData
	});
};