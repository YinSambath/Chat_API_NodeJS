const Todo = require("../models/todo");
const FolderTodo = require("../models/FolderTodo");
const moment = require("moment");
const { createTodoValidation } = require("../validations/validation");

exports.create_todo = async (req, res) => {
	const { error } = createTodoValidation(req.body);
	if (error) {
		return res.status(400).json({ error: error.details[0].message });
	}
	const createdDate = moment().format("MMM DD, YYYY");
	const folderId = req.body.folderId;
	const checkFolder = await FolderTodo.findById(folderId);
	if (!checkFolder) {
		return res.status(404).json({ error: "Please create folder first!!!" });
	} else {
		const todo = new Todo({
			folderId: folderId,
			title: req.body.title,
			note: req.body.note,
			dateTime: req.body.dateTime,
			repeat: req.body.repeat,
			endRepeat: req.body.endRepeat,
			location: req.body.location,
			priority: req.body.priority,
			reminder: req.body.reminder,
			progress: req.body.progress,
			createdDate: createdDate,
			userId: req.user.userId,
			folder: checkFolder,
		});
		console.log(todo.folder);
		try {
			const newTodo = await todo.save();
			return res.status(200).json({ data: newTodo });
		} catch (err) {
			return res.status(500).json({
				error: err,
			});
		}
	}
};
exports.list_todo = async (req, res) => {
	const folderId = req.body.folderId;
	const checkFolder = await FolderTodo.findById(folderId);
	if (!checkFolder) {
		return res.status(404).json({ error: "Please create folder first!!!" });
	} else {
		const todos = await Todo.paginate(
			{ folderId: checkFolder.id },
			{
				page: req.query.page == null ? 1 : req.query.page,
				limit: req.query.limit == null ? 10 : req.query.limit,
				sort: {_id:-1}
			},
		);
		return res.status(200).json({ data: todos });
		// return res.status(200).json({ message: "ok" });
	}
};
exports.view_todo = async (req, res) => {
	const todoId = req.params.todoId;
	const todo = await Todo.findById(todoId);
	if (!todo) {
		return res.status(404).json({ error: "Not found!!!" });
	} else {
		return res.status(200).json({ todo });
	}
};
exports.delete_todo = async (req, res) => {
	const folderId = req.body.folderId;
	const checkFolder = await FolderTodo.findById(folderId);
	if (!checkFolder) {
		return res.status(404).json({ error: "Please create folder first!!!" });
	}
	try {
		const todoId = req.params.todoId;
		const todo = await Todo.findById(todoId);
		if (!todo) {
			return res.status(404).json({
				error: "not found",
			});
		}
		const removeTodo = await Todo.deleteOne(todo);
		if (removeTodo) {
			return res.status(200).json({ message: "Todo has been delete." });
		} else {
			return res.status(400).json({
				error: "Somthing went wrong!!!",
			});
		}
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};
exports.update_todo = async (req, res) => {
	const folderId = req.body.folderId;
	const folder = await Todo.find({ folderId: folderId });
	if (!folder) {
		return res.status(404).json({ error: "Folder Not found!" });
	}
	try {
		const todoId = req.params.todoId;
		const updateInfo = req.body;
		const options = { new: true };
		const checkTodo = await Todo.find({ todoId: todoId });
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkTodo) {
			return res.status(404).json({ error: "Todo Not found!" });
		} else {
			const updatedInfo = await Todo.findByIdAndUpdate(
				todoId,
				updateInfo,
				options,
			);
			if (updatedInfo) {
				const todo = await Todo.findByIdAndUpdate(
					todoId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: todo,
				});
			} else {
				return res.status(500).json({ error: "Update failed!" });
			}
		}
	} catch (err) {
		res.status(500).json({ message: "Something went wrong!" });
	}
};
exports.mark_done = async (req, res) => {
	const folderId = req.body.folderId;
	const folder = await Todo.find({ folderId: folderId });
	if (!folder) {
		return res.status(404).json({ error: "Not found!!!!" });
	}
	try {
		const todoId = req.params.todoId;
		const mark = req.body.mark;
		const options = { new: true };
		const checkTodo = await Todo.findById(todoId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkTodo) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await Todo.findByIdAndUpdate(
				todoId,
				{ mark: mark },
				options,
			);
			if (updatedInfo) {
				const todo = await Todo.findByIdAndUpdate(
					todoId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: todo,
				});
			} else {
				return res.status(500).json({ error: "something went wrong" });
			}
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.search_todo = async (req, res) => {
	const search = req.query.search;
	const userId = req.user.userId;
	const folderId = req.body.folderId;
	// console.log(folderId);
	const filter = await Todo.paginate(
		{
			$and: [
				{ folderId: folderId },
				{ userId: userId },
				{ title: { $regex: new RegExp(search) } },
			],
		},
		{
			page: req.query.page == null ? 1 : req.query.page,
			limit: req.query.limit == null ? 10 : req.query.limit,
		},
	);
	if (filter) {
		return res.status(200).json({ data: filter });
	} else {
		return res.status(404).json({ error: err.message });
	}
};
exports.todo_reminder = async (req, res) => {
	const folderId = req.body.folderId;
	const folder = await Todo.find({ folderId: folderId });
	if (!folder) {
		return res.status(404).json({ error: "Not found!!!!" });
	}
	try {
		const todoId = req.params.todoId;
		const reminder = req.body.reminder;
		const options = { new: true };
		const checkTodo = await Todo.findById(todoId);
		const updatedDate = moment().format("MMM DD, YYYY");
		if (!checkTodo) {
			return res.status(404).json({ error: "Not found!!!" });
		} else {
			const updatedInfo = await Todo.findByIdAndUpdate(
				todoId,
				{ reminder: reminder },
				options,
			);
			if (updatedInfo) {
				const todo = await Todo.findByIdAndUpdate(
					todoId,
					{ updatedDate: updatedDate },
					options,
				);
				return res.status(200).json({
					data: todo,
				});
			} else {
				return res.status(500).json({ error: "something went wrong" });
			}
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
exports.short_today = async (req, res) => {
	const userId = req.user.userId;

	const date = moment().format("MMM DD, YYYY");

	const shortToday = await Todo.find({
		userId: userId,
		$or: [{ createdDate: date }, { updatedDate: date }],
	});

	return res.status(200).json({ data: shortToday });
};
exports.short_all = async (req, res) => {
	const getLastest = await Todo.find({userId: req.user.userId}).sort({createdDate:-1});
	return res.status(200).json({data:getLastest});
}


// exports.delete_all = async (req, res) => {
// 	const deleteAll = await Todo.remove({});
	
// 	if (deleteAll) {
// 		return res.json("done");
// 	} else {
// 		return res.json("error");
// 	}
// }