const router = require("express").Router();
const TodoController = require("../controllers/todos");
const { verifyAccessToken } = require("../helpers/jwt_helper");
const mongoose = require("mongoose");
const Todo = mongoose.model("Todo");

// router.patch("/deleteAll", verifyAccessToken, TodoController.delete_all);

router.post("/create", verifyAccessToken, TodoController.create_todo);
router.get("/shortToday", verifyAccessToken, TodoController.short_today);
router.get("/shortAll", verifyAccessToken, TodoController.short_all);
router.post("/", verifyAccessToken, TodoController.search_todo);
router.post("/list", verifyAccessToken, TodoController.list_todo);
router.get("/:todoId", verifyAccessToken, TodoController.view_todo);
router.patch("/delete/:todoId", verifyAccessToken, TodoController.delete_todo);
router.put("/update/:todoId", verifyAccessToken, TodoController.update_todo);
router.put("/markAsDone/:todoId", verifyAccessToken, TodoController.mark_done);
module.exports = router;
