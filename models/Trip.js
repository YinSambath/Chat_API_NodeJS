const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const tripSchema = new mongoose.Schema({
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
	lat: {
		type: "Number"
	},
	lng: {
		type: "Number"
	},
	member: {
		type: "number",
		default: 0,
	},
	contact: [
	],
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	
});
tripSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Trip", tripSchema);
