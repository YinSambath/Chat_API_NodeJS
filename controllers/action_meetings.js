const { find } = require("lodash");
const moment = require("moment");
const mongoose = require("mongoose");
const Meeting = mongoose.model("Meeting");
const Contact = mongoose.model("Contact");
const ActionMeeting = require("../models/ActionMeeting");
const { createActionMeetingValidation } = require("../validations/validation");

exports.create_action = async (req, res) => {
	const { error } = createActionMeetingValidation(req.body);
	if (error) {
		return res.status(400).json({ error: error });
	}
	const created = moment().format("MMM DD, YYYY");
	const meetingId = req.body.meetingId;
	const assignTo = req.body.assignTo;
	const checkMeeting = await Meeting.findById(meetingId);
	const userInfo = await Contact.findById(assignTo);
	if (!checkMeeting) {
		return res.status(404).json({ error: "Please create folder first!!!" });
	} else {
		const action = new ActionMeeting({
			meetingId: meetingId,
			title: req.body.title,
			note: req.body.note,
			endDate: req.body.endDate,
			startDate: req.body.startDate,
			repeat: req.body.repeat,
			endRepeat: req.body.endRepeat,
			location: req.body.location,
			priority: req.body.priority,
			reminder: req.body.reminder,
			progress: req.body.progress,
			userId: req.user.userId,
			createdDate: created,
			meeting: checkMeeting,
			assignTo: userInfo,
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
	}
};
exports.list_action = async (req, res) => {
	const userId = req.user.userId;
	const meetingId = req.body.meetingId;
	const checkMeeting = await Meeting.findById(meetingId);
	if (!checkMeeting) {
		return res.status(404).json({ error: "Not found!!!" });
	}
	try {
		const actions = await ActionMeeting.find({
			$and: [{ userId: userId }, { meetingId: meetingId }],
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
	const meetingId = req.body.meetingId;
	const checkMeeting = await Meeting.findById(meetingId);
	if (!checkMeeting) {
		return res.status(404).json({ error: "Not found!!!" });
	}
	try {
		const actionId = req.params.actionId;
		const action = await ActionMeeting.findById(actionId);
		if (!action) {
			return res.status(404).json({
				error: "not found",
			});
		}
		const removeAction = await ActionMeeting.deleteOne(action);
		if (removeAction) {
			return res.status(200).json({ message: "Action has been delete." });
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
	const meetingId = req.body.meetingId;
	const checkMeeting = await Meeting.findById(meetingId);
	const userId = req.body.userId;
	if (!checkMeeting) {
		return res.status(404).json({ error: "Not found!!!" });
	}
	try {
		const actionId = req.params.actionId;
		const updateInfo = req.body;
		const options = { new: true };
		const checkAction = await ActionMeeting.findById(actionId);
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
			const updatedInfo = await ActionMeeting.findByIdAndUpdate(
				actionId,
				updateInfo,
				options,
			);
			if (updatedInfo) {
				const action = await ActionMeeting.findByIdAndUpdate(
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
	const meetingId = req.body.meetingId;
	// console.log(folderId);
	const filter = await ActionMeeting.find({
		$and: [
			{ meetingId: meetingId },
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
	const meetingId = req.body.meetingId;
	const meeting = await ActionMeeting.find({ meetingId: meetingId });
	if (!meeting) {
		return res.status(404).json({ error: "Not found!!!!" });
	}
	try {
		const actionId = req.params.actionId;
		const mark = req.body.mark;
		const options = { new: true };
		const checkAction = await ActionMeeting.findById(actionId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkAction) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await ActionMeeting.findByIdAndUpdate(
				actionId,
				{ mark: mark },
				options,
			);
			if (updatedInfo) {
				const action = await ActionMeeting.findByIdAndUpdate(
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
	const meetingId = req.body.meetingId;
	const meeting = await ActionMeeting.find({ meetingId: meetingId });
	if (!meeting) {
		return res.status(404).json({ error: "Not found!!!!" });
	}
	try {
		const actionId = req.params.actionId;
		const reminder = req.body.reminder;
		const options = { new: true };
		const checkAction = await ActionMeeting.findById(actionId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkAction) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await ActionMeeting.findByIdAndUpdate(
				actionId,
				{ reminder: reminder },
				options,
			);
			if (updatedInfo) {
				const action = await ActionMeeting.findByIdAndUpdate(
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
	const shortToday = await ActionMeeting.find({
		userId: userId,
		$or: [{ createdDate: date }, { updatedDate: date }],
	}).limit(5);
	return res.status(200).json({ data: shortToday });
};
exports.short_all = async (req,res) => {
	const getLastest = await ActionMeeting.find({userId: req.user.userId}).sort({_id:-1});
	return res.status(200).json({data: getLastest});
}

// exports.delete_all = async (req, res) => {
// 	const deleteAll = await ActionMeeting.remove({});
	
// 	if (deleteAll) {
// 		return res.json("done");
// 	} else {
// 		return res.json("error");
// 	}
// }