//VALIDATION
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
	const schema = Joi.object({
		firstname: Joi.string().min(2).required(),
		lastname: Joi.string().min(2).required(),
		username: Joi.string().min(2).required(),
		email: Joi.string().min(6).email(),
		password: Joi.string().min(6).required(),
		comfirmedPassword: Joi.string().min(6).required(),
		phone: Joi.string().min(9).required(),
	});
	return schema.validate(data);
};
const loginValidation = (data) => {
	const schema = Joi.object({
		phone: Joi.string().min(6).required(),
		password: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};
const renewPasswordValidation = (data) => {
	const schema = Joi.object({
		resetLink: Joi.string().required(),
		password: Joi.string().min(6).required(),
		comfirmedPassword: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};
const changePasswordValidation = (data) => {
	const schema = Joi.object({
		id: Joi.string().required(),
		currentPassword: Joi.string().min(6).required(),
		newPassword: Joi.string().min(6).required(),
		newComfirmedPassword: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};
const createContactValidation = (data) => {
	const schema = Joi.object({
		phone: Joi.string().min(8).max(10).required(),
		firstname: Joi.string(),
		lastname: Joi.string(),
		email: Joi.string().email(),
	});
	return schema.validate(data);
};
const createTodoValidation = (data) => {
	const schema = Joi.object({
		folderId: Joi.string().required(),
		title: Joi.string().required(),
		note: Joi.string(),
		dateTime: Joi.string(),
		repeat: Joi.string(),
		endRepeat: Joi.string(),
		location: Joi.string(),
		priority: Joi.string(),
		reminder: Joi.boolean(),
		progress: Joi.number(),
	});
	return schema.validate(data);
};
const createTripValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		note: Joi.string(),
		startDate: Joi.string(),
		endDate: Joi.string(),
		lat: Joi.number(),
		lng: Joi.number(),
		location: Joi.string(),
		reminder: Joi.boolean(),
		progress: Joi.number(),
	});
	return schema.validate(data);
};
const createActionValidation = (data) => {
	const schema = Joi.object({
		tripId: Joi.string().required(),
		title: Joi.string().required(),
		note: Joi.string(),
		startDate: Joi.string(),
		endDate: Joi.date(),
		location: Joi.string(),
		reminder: Joi.boolean(),
		progress: Joi.number(),
		assignTo: Joi.string(),
		userId: Joi.string().required,
	});
	return schema.validate(data);
};
const createMeetingValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		note: Joi.string(),
		startDate: Joi.string(),
		endDate: Joi.string(),
		location: Joi.string(),
		reminder: Joi.boolean(),
		progress: Joi.number(),
	});
	return schema.validate(data);
};
const createActionMeetingValidation = (data) => {
	const schema = Joi.object({
		meetingId: Joi.string().required(),
		title: Joi.string().required(),
		note: Joi.string(),
		startDate: Joi.string(),
		endDate: Joi.string(),
		repeat: Joi.string(),
		endRepeat: Joi.string(),
		location: Joi.string(),
		priority: Joi.string(),
		reminder: Joi.boolean(),
		progress: Joi.number(),
		assignTo: Joi.string(),
	});
	return schema.validate(data);
};
const createPlanningValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().required(),
		note: Joi.string(),
		startDate: Joi.string(),
		endDate: Joi.string(),
		location: Joi.string(),
		reminder: Joi.boolean(),
		progress: Joi.number(),
	});
	return schema.validate(data);
};
const createActionPlanningValidation = (data) => {
	const schema = Joi.object({
		planningId: Joi.string().required(),
		title: Joi.string().required(),
		note: Joi.string(),
		startDate: Joi.string(),
		endDate: Joi.string(),
		repeat: Joi.string(),
		endRepeat: Joi.string(),
		location: Joi.string(),
		priority: Joi.string(),
		reminder: Joi.boolean(),
		progress: Joi.number(),
		assignTo: Joi.string(),
	});
	return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.renewPasswordValidation = renewPasswordValidation;
module.exports.changePasswordValidation = changePasswordValidation;
module.exports.createContactValidation = createContactValidation;
module.exports.createTodoValidation = createTodoValidation;
module.exports.createTripValidation = createTripValidation;
module.exports.createActionValidation = createActionValidation;
module.exports.createMeetingValidation = createMeetingValidation;
module.exports.createActionMeetingValidation = createActionMeetingValidation;
module.exports.createPlanningValidation = createPlanningValidation;
module.exports.createActionPlanningValidation = createActionPlanningValidation;
