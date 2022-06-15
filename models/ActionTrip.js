const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const actionSchema = new mongoose.Schema({
	tripId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Trip",
		require: true,
	},
	title: {
		type: "String",
		default: "",
	},
	note: {
		type: "String",
		default: "N/A",
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
	tripActionImage: {
		type: "String",
		default: "",
	},
	createdDate: {
		type: "String",
	},
	updatedDate: {
		type: "String",
		default: "",
	},
	mark: {
		type: "Boolean",
		default: false,
	},
	
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		require: true,
	},
	assignTo: {},
});
actionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Action", actionSchema);
