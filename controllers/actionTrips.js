const mongoose = require("mongoose");
const Trip = mongoose.model("Trip");
const Contact = mongoose.model("Contact");
const Action = require("../models/ActionTrip");
const moment = require("moment");
const { createActionValidation } = require("../validations/validation");
const ActionMeeting = require("../models/ActionMeeting");
const User = require("../models/User");

exports.create_action = async (req, res) => {
	const { error } = createActionValidation(req.body);
	const tripId = req.body.tripId;
	const assignTo = req.body.assignTo;
	if (error) {
		return res.status(400).json({ error: error });
	}
	const created = moment().format("MMM DD, YYYY");
	const checkTrip = await Trip.findById(tripId);
	if (!checkTrip) {
		return res.status(404).json({ error: "trip not found!!!" });
	}
	const userInfo = await Contact.findById(assignTo);
	console.log(userInfo);
	const action = new Action({
		tripId: req.body.tripId,
		title: req.body.title,
		note: req.body.note,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		location: req.body.location,
		reminder: req.body.reminder,
		progress: req.body.progress,
		assignTo: userInfo,
		userId: req.user.userId,
		createdDate: created,
		trip: checkTrip,
	});
	
	try {
		const newAction = await action.save();
		console.log(newAction);
		return res.status(200).json({ data: newAction });
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};
exports.list_action = async (req, res) => {
	const userId = req.user.userId;
	const tripId = req.body.tripId;
	const checkTrip = await Trip.findById(tripId);
	if (!checkTrip) {
		return res.status(404).json({ error: "Not found!!!" });
	}
	try {
		const actions = await Action.find({
			$and: [{ userId: userId }, { tripId: tripId }],
		});
		if (actions != null) {
			return res.status(200).json({
				data: actions,
			});
		}
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};
exports.delete_action = async (req, res) => {
	const tripId = req.body.tripId;
	const checkTrip = await Trip.findById(tripId);
	if (!checkTrip) {
		return res.status(404).json({ error: "Not found!!!" });
	}
	try {
		const actionId = req.params.actionId;
		const action = await Action.findById(actionId);
		if (!action) {
			return res.status(404).json({
				error: "not found",
			});
		}
		const removeAction = await Action.deleteOne(action);
		if (removeAction) {
			return res.status(200).json({ message: "Action has been delete." ,data: removeAction});
		} else {
			return res.status(400).json({
				error: "Somthing went wrong!!!",
			});
		}
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};
exports.update_action = async (req, res) => {
	const tripId = req.body.tripId;
	const checkTrip = await Trip.findById(tripId);
	const userId = req.body.userId;
	if (!checkTrip) {
		return res.status(404).json({ error: "Not found!!!" });
	}
	try {
		const actionId = req.params.actionId;
		const updateInfo = req.body;
		const options = { new: true };
		const checkAction = await Action.findById(actionId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (userId) {
			const user = await User.findById(userId);
			if (!user) {
				return res.status(404).json({ error: "User not found!!!" });
			}
		}
		if (!checkAction) {
			return res.status(404).json({ error: "Not found!!" });
		} else {
			const updatedInfo = await Action.findByIdAndUpdate(
				actionId,
				updateInfo,
				options,
			);
			if (updatedInfo) {
				const action = await Action.findByIdAndUpdate(
					actionId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: action,
				});
			} else {
				return res.status(500).json({ error: "something went wrong" });
			}
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.search_action = async (req, res) => {
	const search = req.query.search;
	const userId = req.user.userId;
	const tripId = req.body.tripId;
	// console.log(folderId);
	const filter = await Action.find({
		$and: [
			{ tripId: tripId },
			{ userId: userId },
			{ title: { $regex: new RegExp(search) } },
		],
	});
	if (filter) {
		return res.status(200).json({ data: filter });
	} else {
		return res.status(404).json({ error: err.message });
	}
};
exports.mark_done = async (req, res) => {
	const tripId = req.body.tripId;
	const trip = await Action.find({ tripId: tripId });
	if (!trip) {
		return res.status(404).json({ error: "Not found!!!!" });
	}
	try {
		const actionId = req.params.actionId;
		const mark = req.body.mark;
		const options = { new: true };
		const checkAction = await Action.findById(actionId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkAction) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await Action.findByIdAndUpdate(
				actionId,
				{ mark: mark },
				options,
			);
			if (updatedInfo) {
				const action = await Action.findByIdAndUpdate(
					actionId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: action,
				});
			} else {
				return res.status(500).json({ error: "something went wrong" });
			}
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.action_reminder = async (req, res) => {
	const tripId = req.body.tripId;
	const trip = await Action.find({ tripId: tripId });
	if (!trip) {
		return res.status(404).json({ error: "Not found!!!!" });
	}
	try {
		const actionId = req.params.actionId;
		const reminder = req.body.reminder;
		const options = { new: true };
		const checkAction = await Action.findById(actionId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkAction) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await Action.findByIdAndUpdate(
				actionId,
				{ reminder: reminder },
				options,
			);
			if (updatedInfo) {
				const action = await Action.findByIdAndUpdate(
					actionId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: action,
				});
			} else {
				return res.status(500).json({ error: "something went wrong" });
			}
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.short_today = async (req, res) => {
	const userId = req.user.userId;
	const date = moment().format("MMM DD, YYYY");
	const shortToday = await Action.find({
		userId: userId,
		$or: [{ createdDate: date }, { updatedDate: date }],
	}).limit(5);
	return res.status(200).json({ data: shortToday });
};
exports.short_all = async (req, res) => {
	const getLastest = await Action.find({userId: req.user.userId}).sort({createdDate:-1});
	return res.status(200).json({data: getLastest});
}