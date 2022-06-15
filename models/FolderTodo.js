const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const folderTodoSchema = new mongoose.Schema({
	name: {
		type: "String",
		required: true,
		default: "",
	},
	todo: {
		type: "Number",
	},

	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

folderTodoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("FolderTodo", folderTodoSchema);
