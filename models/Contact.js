const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const contactSchema = new mongoose.Schema({
	firstname: {
		type: "String",
		default: "",
	},
	lastname: {
		type: "String",
		default: "",
	},
	email: {
		type: "String",
		min: 6,
		max: 255,
		default: "",
	},
	phone: {
		type: "String",
		required: true,
	},
	contactProfile: {
		type: "String",
		default: "",
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});
contactSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Contact", contactSchema);
