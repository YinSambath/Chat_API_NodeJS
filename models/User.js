const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstname: {
		type: "String",
		min: 6,
		max: 255,
		default: "",
	},
	lastname: {
		type: "String",
		min: 6,
		max: 255,
		default: "",
	},
	username: {
		type: "String",
		required: true,
		min: 6,
		max: 255,
	},
	email: {
		type: "String",
		min: 6,
		max: 255,
		default: "",
	},
	password: {
		type: "String",
		required: true,
		max: 1024,
	},
	comfirmedPassword: {
		type: "String",
		required: true,
		max: 1024,
	},
	date: {
		type: "Date",
		default: Date.now,
	},
	token: {
		type: "String",
		default: "",
	},
	refreshToken: {
		type: "String",
		default: "",
	},
	resetLink: {
		type: "String",
		default: "",
	},
	phone: {
		type: "String",
		required: true,
	},
	userProfile: {
		type: "String",
		default: "",
	},
	dob: {
		type: "String",
		default: "",
	},
	address: {
		type: "String",
		default: "",
	},
	website: {
		type: "String",
		default: "",
	},
	status: {
		type: "String",
		default: "",
	},
	nationality: {
		type: "String",
		default: "",
	},
	gender: {
		type: "String",
		default: "",
	},
	contact: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contact",
	},
});

module.exports = mongoose.model("User", userSchema);
