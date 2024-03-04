const mongoose = require("mongoose");
const moment = require("moment");
const Chat = require("../models/chat");
const Contact = require("../models/Contact");
const User = require("../models/User");


exports.create_chat = async (req, res) => {
	
	try {
		const person1Id = req.body.person1Id;
		const person1Name = req.body.person1Name;
		const person2Phone = req.body.person2Phone;

		const person2 = await User.find({ phone: person2Phone });
		if (!person2[0]) {
			return res.status(404).json('user does not exist!');
		}
		const person2Id = person2[0]._id;
		const person2Name = ( person2[0].firstname !== '' && person2[0].lastname !== '' ) ? (person2[0].firstname + ' ' + person2[0].lastname) : person2[0].phone;

		const checkChat = await Chat.find({
			$or: [{ person1Id: person2Id }, { person2Id: person2Id }],
		});
		if (checkChat[0]) {
			return res.status(201).json({ data: person2Id });
		}
		const chat = new Chat({
			person1Id: person1Id,
			person1Name: person1Name,
			person2Id: person2Id,
			person2Name: person2Name,
			message: []
		});
		const newChat = await chat.save();
		if (newChat) {
			return res.status(200).json(newChat);
		}
	} catch (err) {
		return res.status(500).json({
			error: err,
		});
	}
};
exports.list_chat = async (req, res) => {
    let chats = [];
	const person1Id = req.user.userId;
    chats = await Chat.find({
        $or: [{ person1Id: person1Id }, { person2Id: person1Id }],
    });
	return res.status(200).json({
        data: chats,
    });
};
exports.get_chat = async (req, res) => {
    let private_chat = [];
	const person1Id = new mongoose.Types.ObjectId(req.user.userId);
	const person2Id = new mongoose.Types.ObjectId(req.params.person2Id);
	private_chat = await Chat.findOne({
        $or: [
			{$and: [{ person1Id: person1Id }, { person2Id: person2Id }]},
			{$and: [{ person1Id: person2Id }, { person2Id: person1Id }]}
		]
    });
	// console.log(private_chat)
	return res.status(200).json(private_chat);
};
exports.send_image = async (req, res) => {
	try {
		const filename = req.file.filename;
		return res.status(200).json(filename)
	} catch (err) {
		return res.status(500).json({error: err})
	}
}