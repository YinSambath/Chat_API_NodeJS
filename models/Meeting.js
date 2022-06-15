const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const meetingSchema = new mongoose.Schema({
	title: {
		type: "String",
		default: "",
	},
	note: {
		type: "String",
		default: "",
	},
	startDate: {
		type: "String",
		default: "",
	},
	endDate: {
		type: "String",
		default: "",
	},
	location: {
		type: "String",
	},
	reminder: {
		type: "Boolean",
		default: false,
	},
	progress: {
		type: "Number",
		default: "",
	},
	tripImage: {
		type: "String",
		default: "",
	},
	updatedDate: {
		type: "String",
		default: "",
	},
	mark: {
		type: "Boolean",
		default: false,
	},
	member: {
		type: "number",
		default: "",
	},

	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	contact: [
		
	],
});
meetingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Meeting", meetingSchema);
