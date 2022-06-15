const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var Schema = mongoose.Schema;
const meetingSchema = new mongoose.Schema({
	title: {
		type: "String",
		default: "",
	},
	note: {
		type: "String",
	},
	startDate: {
		type: "String",
		default: "",
	},
	endDate: {
		type: "String",
		default: "",
	},
	repeat: {
		type: "String",
		default: "",
	},
	endRepeat: {
		type: "String",
		default: "",
	},
	location: {
		type: "String",
	},
	priority: {
		type: "String",
		default: "",
	},
	reminder: {
		type: "Boolean",
		default: false,
	},
	progress: {
		type: "Number",
		default: "",
	},
	file: {
		type: "String",
	},
	createdDate: {
		type: "String",
	},
	updatedDate: {
		type: "String",
	},
	mark: {
		type: "Boolean",
		default: false,
	},
	meetingId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "FolderTodo",
		required: true,
	},
	assignTo: {},	
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});
meetingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("actionMeeting", meetingSchema);
