const jwt = require("jsonwebtoken");
const createError = require("http-errors");
module.exports = {
	accessToken: (userId) => {
		return new Promise((resolve, reject) => {
			jwt.sign(
				{},
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: "1d",
				},
				(err, res) => {
					if (err) reject(err);
					resolve(res);
				},
			);
		});
	},
	verifyAccessToken: (req, res, next) => {
		const token = req.header("auth-token");
		if (!token) return res.status(401).json("Access Denied");
		try {
			const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.user = verified;
		} catch (err) {
			res.status(500).json("Invalid Token");
		}
		return next();
	},
	refreshToken: (userId) => {
		return new Promise((resolve, reject) => {
			jwt.sign(
				{},
				process.env.REFRESH_TOKEN_SECRET,
				{
					expiresIn: "1y",
				},
				(err, res) => {
					if (err) reject(err);
					resolve(res);
				},
			);
		});
	},
	verifyRefreshToken: (refreshToken) => {
		return new Promise((resolve, reject) => {
			jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET,
				(err, payload) => {
					if (err) return reject(err);
					const userId = payload.aud;
					resolve(userId);
				},
			);
		});
	},
	resetPasswordAccessToken: (userId) => {
		return new Promise((resolve, reject) => {
			jwt.sign(
				{},
				process.env.RESET_PASSWORD_KEY,
				{
					expiresIn: "1h",
				},
				(err, res) => {
					if (err) reject(err);
					resolve(res);
				},
			);
		});
	},
	verifyResetPassAccessToken: (resetPasswordAccessToken) => {
		jwt.verify(
			resetPasswordAccessToken,
			process.env.RESET_PASSWORD_KEY,
			(err, res) => {
				if (err) reject(err);
			},
		);
	},
};
