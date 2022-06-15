// const { remove } = require("lodash");
const Contact = require("../models/Contact");
const User = require("../models/User");
const { createContactValidation } = require("../validations/validation");

exports.create_contact = async (req, res) => {
	const { error } = createContactValidation(req.body);
	const phone = req.body.phone;
	const userId = req.user.userId;
	if (error) return res.status(400).json({ error: error.details[0].message });
	const contactUser = await Contact.find({
		$and: [{ phone: phone }, { userId: userId }],
	});
	if (!contactUser) {
		return res.status(400).json({ message: "Contact already exist!!!" });
	}
	try {
		const accountUser = await User.find({ phone: phone });
		console.log(accountUser);
		if (accountUser.length !=0 ) {
			const contact = new Contact({
				phone: phone,
				firstname: accountUser[0].firstname,
				lastname: accountUser[0].lastname,
				email: accountUser[0].email,
				userId: req.user.userId,
			});
			const newContact = await contact.save();
			return res.status(200).json({
				message: "Create successfully",
				data: newContact,
			});
		} 
		else {
			const contact = new Contact({
				phone: req.body.phone,
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				userId: req.user.userId,
			});
			const newContact = await contact.save();
			console.log("Done!");
			return res.status(200).json({
				message: "Create successfully",
				data: newContact,
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			error: "Error",
		});
	}
};
exports.list_contact = async (req, res) => {
	const userId = req.user.userId;
	try {
		const contacts = await Contact.paginate(
			{ userId: userId },
			{
				page: req.query.page == null ? 1 : req.query.page,
				limit: req.query.limit == null ? 10 : req.query.limit,
			},
		);
		if (contacts != null) {
			return res.status(200).json({ data: contacts });
		}
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};
exports.view_contact = async (req, res) => {
	const contactId = req.params.contactId;
	if (!contactId) {
		return res.status(404).json({ message: "Contact not found!!!" });
	}
	const contact = await Contact.findById(contactId);
	try {
		if (!contact) {
			return res.status(404).json({
				error: "Contact not found!!!",
			});
		}
		return res.status(200).json({
			contact,
		});
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};
exports.delete_contact = async (req, res) => {
	try {
		const contactId = req.params.contactId;
		const contact = await Contact.findById(contactId);
		if (!contact) {
			return res.status(404).json({
				error: "Contact not found",
			});
		}
		const removeContact = await Contact.deleteOne(contact);
		if (removeContact) {
			return res
				.status(200)
				.json({ message: "Contact has been delete." });
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
exports.update_contact = async (req, res) => {
	try {
		const contactId = req.params.contactId;
		const updateInfo = req.body;
		const options = { new: true };
		const checkContact = await Contact.findById(contactId);
		if (!checkContact) {
			return res.status(404).json({ error: "Contact not found!!!" });
		} else {
			const contact = await Contact.findByIdAndUpdate(
				contactId,
				updateInfo,
				options,
			);
			res.status(200).json({
				message: "Update successfully",
				contact: contact,
			});
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.search_contact = async (req, res) => {
	const search = req.query.search;
	const userId = req.user.userId;

	const filter = await Contact.paginate(
		{
			userId: req.user.userId,
			$or: [
				{
					firstname: { $regex: new RegExp(search) },
				},
				{
					lastname: { $regex: new RegExp(search) },
				},
				{
					phone: { $regex: new RegExp(search) },
				},
			],
		},
		{
			page: req.query.page == null ? 1 : req.query.page,
			limit: req.query.limit == null ? 10 : req.query.limit,
		},
		{
			_id: 0,
			__v: 0,
		},
	);
	if (filter) {
		return res.status(200).json({ data: filter });
	}
};
