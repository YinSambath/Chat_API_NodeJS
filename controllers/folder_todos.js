const mongoose = require("mongoose");
const FolderTodo = require("../models/FolderTodo");
const Todo = mongoose.model("Todo");
exports.create_folder = async (req, res) => {
	const name = req.body.name;
	const folderTodo = new FolderTodo({
		name: name,
		userId: req.user.userId,
	});
	try {
		const createFolder = await folderTodo.save();
		return res.status(200).json({ data: createFolder });
	} catch (err) {
		return res.status(500).json({ Error: "Something went wrong!!!" });
	}
};
exports.list_folder = async (req, res) => {
	const userId = req.user.userId;
	const folderData = await FolderTodo.find({ userId: userId });
	if (folderData) {
		return res.status(200).json({ data: folderData });
	} else {
		return res.status(500).json({ Error: "Something went wrong!!!" });
	}
};
exports.delete_folder = async (req, res) => {
	const folderId = req.params.folderId;
	const checkFolder = await FolderTodo.findById(folderId);
	try {
		if (!checkFolder) {
			return res.status(404).json({
				error: "not found",
			});
		}
		const removeFolder = await FolderTodo.deleteOne(checkFolder);
		if (removeFolder) {
			const deleteTodo = await Todo.deleteMany({ folderId: folderId });
			return res.status(200).json({ message: "Folder has been delete." });
		} else {
			return res.status(400).json({
				error: "Somthing went wrong!!!",
			});
		}
	} catch (err) {
		res.status(500).json({
			error: err.message,
		});
	}
};
exports.update_folder = async (req, res) => {
	const folderId = req.params.folderId;
	const newInfo = req.body;
	const options = { new: true };
	const checkFolder = await FolderTodo.findById(folderId);
	if (!checkFolder) {
		return res.status(404).json({ error: "Folder not found!!!" });
	}
	try {
		const folder = await FolderTodo.findByIdAndUpdate(
			folderId,
			newInfo,
			options,
		);
		return res.status(200).json({ data: folder });
	} catch (err) {
		return res.status(500).json({ Error: "Something went wrong!!!" });
	}
};
exports.search_folder = async (req, res) => {
	const search = req.query.search;
	const userId = req.user.userId;

	const filter = await FolderTodo.find(
		{
			userId: req.user.userId,
			$or: [
				{
					name: { $regex: new RegExp(search) },
				},
			],
		},
		// {
		// 	_id: 0,
		// 	__v: 0,
		// },
	).limit(10);
	if (filter) {
		return res.status(200).json({ data: filter });
	}
};
