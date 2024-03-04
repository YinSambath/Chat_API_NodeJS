const mongoose = require("mongoose");
mongoose.models = {};
const User = require("../models/User");
// const Trip = require("../models/Trip");
const ActionTrip = require("../models/ActionTrip.js");
// const Todo = require("../models/Todo");
const Contact = require("../models/Contact.js");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
var url = require('url');

const {
	registerValidation,
	loginValidation,
	renewPasswordValidation,
	changePasswordValidation,
} = require("../validations/validation");
const { db } = require("../models/User");
const {
	accessToken,
	refreshToken,
	verifyRefreshToken,
	resetPasswordAccessToken,
	verifyResetPassAccessToken,
} = require("../helpers/jwt_helper");
const { json } = require("express/lib/response");
const { result, options } = require("@hapi/joi/lib/base");
exports.user_register = async (req, res) => {
	//Validate the date before register
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).json(error.details[0].message);
	const phoneExist = await User.findOne({ phone: req.body.phone });
	if (phoneExist) {
		return res.status(400).send("User already exists!");
	}
	//Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	const hashedComfirmedPassword = await bcrypt.hash(
		req.body.comfirmedPassword,
		salt,
	);
	if (hashedComfirmedPassword !== hashedPassword)
		return res.status(400).send("Password is not match!");
	const token = await accessToken(User._id);
	const refToken = await refreshToken(User._id);
	//create new user
	const user = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		username: req.body.username,
		email: req.body.email,
		password: hashedPassword,
		comfirmedPassword: hashedComfirmedPassword,
		token: token,
		refreshToken: refToken,
		phone: req.body.phone,
	});
	try {
		const savedUser = await user.save();
		res.status(200).json({
			savedUser,
		});
	} catch (err) {
		res.status(400).send(err.message);
	}
};
exports.user_login = async (req, res) => {
	//Validation on login
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const user = await User.findOne({ phone: req.body.phone });
	if (!user) {
		return res.status(400).send("User is not found!");
	}
	const userId = user._id;
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) {
		return res.status(400).json({ message: "Password is incorrect!" });
	}
	const userConact = await Contact.find({ userId: userId });
	const userActionTrip = await ActionTrip.find({ userId: userId });

	//create and assign a token
	const newToken = await jwt.sign(
		{ userId: user._id },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "1d" },
	);
	const refToken = await await jwt.sign(
		{ userId: user._id },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: "1y" },
	);
	const newUser = await User.findByIdAndUpdate(
		{ _id: user._id },
		{ token: newToken, refreshToken: refToken },
		{ new: true },
	);
	try {
		res.status(200).json({
			message: "Log in successfully",
			newUser,
		});
	} catch {
		res.status(500).json({ message: err.message });
	}
};
exports.user_logout = async (req, res) => {
	const phone = req.body.phone;
	const user = await User.findOne({ phone: phone });
	if (!user) {
		return res.status(500).json({ message: "User not found" });
	} else {
		res.status(200).json({ message: "Log out successfully" });
	}
};
exports.generateNewAccessToken = async (req, res) => {
	try {
		const { userId } = req.user;
		const oldRefreshToken = req.body.oldRefreshToken;
		if (!oldRefreshToken) throw createError.BadRequest();
		console.log("1");
		const verifyRef = await verifyRefreshToken(oldRefreshToken);
		const token = await await jwt.sign(
			{ userId: userId },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "1d" },
		);
		console.log("1");
		const refToken = await jwt.sign(
			{ userId: userId },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1y" },
		);
		console.log("1");
		res.status(200).json({ accessToken: token, refreshToken: refToken });
	} catch (err) {
		res.status(401).json({
			message: err.message,
		});
	}
};
exports.user_profile = async (req, res) => {
	try {
		const userid = req.params.userId;
		// request.user is getting fetched from Middleware after token authentication
		const user = await User.findById(userid).select(
			"username phone email userImage",
		);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}
		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ message: "Error in fetching user" });
	}
};
exports.upload_update_profile = async (req, res) => {
	const userId = req.params.userId;
	const user = await User.findById(userId);
	if (!user) {
		return res.status(400).json({ error: "User not found" });
	} 
	if (user && user.userProfile != "") {
		const oldProfile = user.userProfile;
		const oldProPath = path.join(__dirname + "../uploads/") + oldProfile;
		// *** Function for upload and delete image from folder upload ***
		if (fs.existsSync(oldProPath)) {
			console.log("Existed path");
			await fs.unlink(oldProPath, (err) => {
				if (err) {
					console.log(err);
					return res.status(404).json("Somthing went wrong!");
				}
			});
		}
	} 
	const uploadOrUpdate = await User.findByIdAndUpdate(
		userId, 
		{userProfile: req.file.filename},
		{new: true}
		);
	return res.status(200).json({
		message: "Your profile have been changed.",
		data: uploadOrUpdate
	});
};
exports.update_user = async (req, res) => {
	try {
		const userId = req.params.userId;
		const updateInfo = req.body;
		const options = { new: true };
		const checkUserExist = await User.findById(userId);
		if (!checkUserExist || null) {
			return res.status(500).json({ message: "User doesn't exist" });
		} else {
			const user = await User.findByIdAndUpdate(
				userId,
				updateInfo,
				options,
			);
			res.status(200).json({
				message: "Update successfully",
				user,
			});
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.check_phone = async (req, res) => {
	const phone = req.body.phone;

	const user = await User.findOne({ phone });
	// console.log(user);
	if (!user) {
		return res.status(400).json({
			message: "Phone doesn't exists!",
		});
	} else {
		const newResetToken = await resetPasswordAccessToken(User._id);
		await User.findOneAndUpdate(
			{ _id: user._id },
			{ resetLink: newResetToken },
			{ upsert: true, new: true },
		);
		return res.status(200).json({
			_id: user._id,
			resetLink: newResetToken,
			phone: user.phone,
		});
	}
};
// function set new password after forgot password.
exports.renew_password = async (req, res) => {
	const { password, comfirmedPassword, resetLink } = req.body;
	const user = await User.findOne({ resetLink });
	console.log(user.resetLink);
	if (user) {
		//validate on input new pass and comfirmedPass
		const { error } = renewPasswordValidation(req.body);
		if (error) return res.status(400).json(error.details[0].message);
		// hash new pass and comfirmedPass
		const salt = await bcrypt.genSalt(10);
		const hashedNewPass = await bcrypt.hash(password, salt);
		const hashedNewComfirmedPass = await bcrypt.hash(
			comfirmedPassword,
			salt,
		);
		if (hashedNewComfirmedPass !== hashedNewPass) {
			return res.status(400).send("Password is not match!");
		}
		await jwt.verify(
			resetLink,
			process.env.RESET_PASSWORD_KEY,
			function (error, decoded) {
				if (!error) {
					User.findOne({ resetLink }, (err, user) => {
						if (err || !user) {
							return res.status(400).json({
								error: "Invalid token or it is expired.",
							});
						}
						const obj = {
							password: hashedNewPass,
							comfirmedPassword: hashedNewComfirmedPass,
							resetLink: "",
						};
						user = _.extend(user, obj);
						user.save((err, result) => {
							if (err) {
								return res.status(400).json({
									error: "Something went wrong!",
								});
							} else {
								return res.status(200).json({
									message: "Your password has been changed.",
								});
							}
						});
					});
				} else {
					return res
						.status(401)
						.json({ error: "Authentication error!!!" });
				}
			},
		);
	} else {
		return res.status(401).json({ error: "Invalid user!" });
		console.log("Hello 7");
	}
};
// function for change password
exports.change_password = async (req, res) => {
	const userId = req.body.id;
	const currentPassword = req.body.currentPassword;
	const newPassword = req.body.newPassword;
	const newComfirmedPassword = req.body.newComfirmedPassword;
	const options = { new: true };

	const { error } = changePasswordValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const user = await User.findById(userId);
	if (user) {
		const validPass = await bcrypt.compare(currentPassword, user.password);
		if (!validPass) {
			return res.status(401).json({
				error: "Invalid password",
			});
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);
		const hashedComfirmedPassword = await bcrypt.hash(
			newComfirmedPassword,
			salt,
		);
		if (hashedComfirmedPassword !== hashedPassword) {
			return res.status(400).send("Password is not match!");
		}
		await User.findByIdAndUpdate(
			{ _id: user._id },
			{
				password: hashedPassword,
				confirmedPassword: hashedComfirmedPassword,
			},
			options,
		);
		await user.save();
		return res.status(200).json({
			message: " Updated password.",
			password: hashedPassword,
		});
	} else {
		return status(500).json({ error: "Somthing wnet wrong!" });
	}
};
exports.list_user = async (req, res) => {
	const userData = await User.find();
	if (userData) {
		return res.status(200).json({ data: userData });
	} else {
		return res.status(500).json({ Error: "No user found!!!" });
	}
};
