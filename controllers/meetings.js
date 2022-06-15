const Meeting = require("../models/meeting");
const ActionMeeting = require("../models/ActionMeeting");
const moment = require("moment");
const { createMeetingValidation } = require("../validations/validation");
const User = require("../models/User");
const Contact = require("../models/Contact");


exports.create_meeting = async (req, res) => {
	const { error } = createMeetingValidation(req.body);
	if (error) {
		return res.status(400).json({ error: error.details[0].message });
	}
	const meetingId = req.body.meetingId;
	const checkMeeting = await Meeting.findById(meetingId);
	if (checkMeeting) {
		return res.status(404).json({ error: "Existing meeting!!!" });
	} else {
		const meeting = new Meeting({
			meetingId: meetingId,
			title: req.body.title,
			note: req.body.note,
			dateTime: req.body.dateTime,
			repeat: req.body.repeat,
			endRepeat: req.body.endRepeat,
			location: req.body.location,
			priority: req.body.priority,
			reminder: req.body.reminder,
			progress: req.body.progress,
			userId: req.user.userId,
		});
		try {
			const newMeeting = await meeting.save();
			return res.status(200).json({ data: newMeeting });
		} catch (err) {
			return res.status(500).json({
				error: err,
			});
		}
	}
};
exports.list_meeting = async (req, res) => {
	const userId = req.user.userId;
	const meeting = await Meeting.paginate(
		{ userId: userId },
		{
			page: req.query.page == null ? 1 : req.query.page,
			limit: req.query.limit == null ? 10 : req.query.limit,
			sort: {_id:-1}
		},
	);
	if (meeting) {
		return res.status(200).json({ data: meeting });
	} else {
		return res.status(500).json({ Error: "Something went wrong!!!" });
	}
};
exports.view_meeting = async (req, res) => {
	const meetingId = req.params.meetingId;
	const meeting = await Meeting.findById(meetingId);
	if (!meeting) {
		return res.status(404).json({ error: "Not found!!!" });
	} else {
		return res.status(200).json({ meeting });
	}
};
exports.delete_meeting = async (req, res) => {
	const meetingId = req.params.meetingId;
	const checkMeeting = await Meeting.findById(meetingId);
	try {
		if (!checkMeeting) {
			return res.status(404).json({
				error: "not found",
			});
		}
		const removeMeeting = await Meeting.deleteOne({_id: meetingId});
		const deleteAction = await ActionMeeting.deleteMany({
			meetingId: meetingId,
		});
		if (removeMeeting && deleteAction) {
			return res
				.status(200)
				.json({ message: "Meeting has been delete." });
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
exports.update_meeting = async (req, res) => {
	const meetingId = req.params.meetingId;
	const newInfo = req.body;
	const options = { new: true };
	const checkMeeting = await Meeting.findById(meetingId);
	if (!checkMeeting) {
		return res.status(404).json({ error: "Meeting not found!!!" });
	}
	try {
		const meeting = await Meeting.findByIdAndUpdate(
			meetingId,
			newInfo,
			options,
		);
		return res.status(200).json({ data: meeting });
	} catch (err) {
		return res.status(500).json({ Error: "Something went wrong!!!" });
	}
};
exports.search_meeting = async (req, res) => {
	const search = req.query.search;
	const userId = req.user.userId;

	const filter = await Meeting.paginate(
		{
			$and: [
				{ userId: userId },
				{ title: { $regex: new RegExp(search) } },
			],
		},
		{
			page: req.query.page == null ? 1 : req.query.page,
			limit: req.query.limit == null ? 10 : req.query.limit,
		},
	);
	if (filter) {
		return res.status(200).json({ data: filter });
	} else {
		return res.status(404).json({ error: err.message });
	}
};
exports.meeting_reminder = async (req, res) => {
	try {
		const meetingId = req.params.meetingId;
		const reminder = req.body.reminder;
		const options = { new: true };
		const checkMeeting = await Meeting.findById(meetingId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkMeeting) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await Meeting.findByIdAndUpdate(
				meetingId,
				{ reminder: reminder },
				options,
			);
			if (updatedInfo) {
				const meeting = await Meeting.findByIdAndUpdate(
					meetingId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: meeting,
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
	const meetingId = req.params.meetingId;
	const user = req.body.user;
	const options = {new: true};
	const userData = [];
	console.log(meetingId);
	for(i=0; i< user.length; i++) {
		const userInfo = await Contact.findById(user[i])
		userData.push(userInfo);
	}
	console.log(userData);
	const checkMeeting = await Meeting.findByIdAndUpdate(meetingId,{contact: userData, member: userData.length}, options);
	if (!checkMeeting) {
		return res.status(404).json({
			message: " Meeting not found"
		});
	}
	console.log("NewData: ")
	console.log(checkMeeting);
	// checkMeeting.member = checkMeeting.user.length;
	const newData = await checkMeeting.save();
	return res.status(200).json({
		data: newData
	});
};
