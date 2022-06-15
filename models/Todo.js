const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
var Schema = mongoose.Schema;
const todoSchema = new mongoose.Schema({
	title: {
		type: "String",
		default: "",
	},
	note: {
		type: "String",
		default: "N/A",
	},
	dataTime: {
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
	todoImage: {
		type: "String",
		default: "N/A",
	},
	createdDate: {
		type: "String",
		default: "N/A",
	},
	updatedDate: {
		type: "String",
		default: "N/A",
	},
	mark: {
		type: "Boolean",
		default: false,
	},
	folderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "FolderTodo",
		required: true,
	},
	folder: {},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});
todoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Todo", todoSchema);
