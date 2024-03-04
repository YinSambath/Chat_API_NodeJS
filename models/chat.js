const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    message: {
		type: Array,
		default: []
	},
	person1Name: {
		type: String,
	},
    person2Name: {
		type: String,
	},
	person1Id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
    person2Id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

chatSchema.set('versionKey', false);

module.exports = mongoose.model("Chat", chatSchema);
