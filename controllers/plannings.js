const Planning = require("../models/planning");
const moment = require("moment");
const ActionPlanning = require("../models/ActionPlanning");
const { createPlanningValidation } = require("../validations/validation");
const User = require("../models/User");
const Contact = require("../models/Contact");

exports.create_planning = async (req, res) => {
	const { error } = createPlanningValidation(req.body);
	if (error) {
		return res.status(400).json({ error: error.details[0].message });
	}
	const planningId = req.body.planningId;
	const checkPlanning = await Planning.findById(planningId);
	if (checkPlanning) {
		return res.status(404).json({ error: "Existing meeting!!!" });
	} else {
		const planning = new Planning({
			planningId: planningId,
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
			const newPlanning = await planning.save();
			return res.status(200).json({ data: newPlanning });
		} catch (err) {
			return res.status(500).json({
				error: err,
			});
		}
	}
};
exports.list_planning = async (req, res) => {
	const userId = req.user.userId;
	const planning = await Planning.paginate(
		{ userId: userId },
		{
			page: req.query.page == null ? 1 : req.query.page,
			limit: req.query.limit == null ? 10 : req.query.limit,
			sort: {_id:-1}
		},
	);
	if (planning) {
		return res.status(200).json({ data: planning });
	} else {
		return res.status(500).json({ Error: "Something went wrong!!!" });
	}
};
exports.view_planning = async (req, res) => {
	const planningId = req.params.planningId;
	const planning = await Planning.findById(planningId);
	console.log(planningId);
	if (!planning) {
		return res.status(404).json({ error: "Not found!!!" });
	} else {
		return res.status(200).json({ planning });
	}
};
exports.delete_planning = async (req, res) => {
	const planningId = req.params.planningId;
	const checkPlanning = await Planning.findById(planningId);
	try {
		if (!checkPlanning) {
			return res.status(404).json({
				error: "not found",
			});
		}
		const removePlanning = await Planning.deleteOne({_id: planningId});
		const deleteAction = await ActionPlanning.deleteMany({
			planningId: planningId,
		});
		if (removePlanning && deleteAction) {
			return res
				.status(200)
				.json({ message: "Planning has been delete." });
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
exports.update_planning = async (req, res) => {
	const planningId = req.params.planningId;
	const newInfo = req.body;
	const options = { new: true };
	const checkPlanning = await Planning.findById(planningId);
	if (!checkPlanning) {
		return res.status(404).json({ error: "Planning not found!!!" });
	}
	try {
		const planning = await Planning.findByIdAndUpdate(
			planningId,
			newInfo,
			options,
		);
		return res.status(200).json({ data: planning });
	} catch (err) {
		return res.status(500).json({ Error: "Something went wrong!!!" });
	}
};
exports.search_planning = async (req, res) => {
	const search = req.query.search;
	const userId = req.user.userId;

	const filter = await Planning.paginate(
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
exports.planning_reminder = async (req, res) => {
	try {
		const planningId = req.params.planningId;
		const reminder = req.body.reminder;
		const options = { new: true };
		const checkPlanning = await Planning.findById(planningId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkPlanning) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await Planning.findByIdAndUpdate(
				planningId,
				{ reminder: reminder },
				options,
			);
			if (updatedInfo) {
				const planning = await Planning.findByIdAndUpdate(
					planningId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: planning,
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
	const planningId = req.params.planningId;
	const user = req.body.user;
	const options = {new: true};
	const userData = [];
	// console.log(userId);
	for(i=0; i<user.length; i++) {
		const userInfo = await Contact.findById(user[i])
		userData.push(userInfo);
	}
	console.log(userData);
	const checkPlanning = await Planning.findByIdAndUpdate(planningId,{contact: userData, member: userData.length}, options);
	if (!checkPlanning) {
		return res.status(404).json({
			message: " Trip not found"
		});
	}
	// checkPlanning.member = checkPlanning.uer.length;
	const newData = await checkPlanning.save();
	return res.status(200).json({
		data: newData
	});
};
