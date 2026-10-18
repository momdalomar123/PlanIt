const bcrypt = require("bcrypt");
const Group = require("../schemas/group.js");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

async function getCategoryWithId(req, categoryId) {
  const result = await Group.aggregate([
    { $match: { username: req.session.username } },
    { $unwind: "$categories" },
    { $unwind: "$categories.category" },
    {
      $match: {
        "categories.category._id": new mongoose.Types.ObjectId(categoryId),
      },
    },
    { $replaceRoot: { newRoot: "$categories.category" } },
    { $limit: 1 },
  ]);

  const category = result[0];
  return category;
}

router.post("/GetTodo", async (req, res) => {
  const { categoryTodoId } = req.body;
  console.log(categoryTodoId);
  const category = await getCategoryWithId(req, categoryTodoId);
  return res.status(200).json(category);
});
router.post("/AddTodo", async (req, res) => {
  const { categoryTodoId, todoTitle, todoImportancy, todoDueTime } = req.body;

  console.log(todoDueTime);
  const updateTodo = await Group.updateOne(
    { username: req.session.username },
    {
      $push: {
        "categories.$[].category.$[cat].groupTodo": {
          title: todoTitle,
          importancy: todoImportancy,
          dueTime: todoDueTime,
        },
      },
    },
    {
      arrayFilters: [{ "cat._id": categoryTodoId }],
    },
  );
  const category = await getCategoryWithId(req, categoryTodoId);
  console.log(category);
  return res.status(200).json(category);
});

async function deleteTodo(req, todoId, categoryId) {
  const deleteTodo = !!(await Group.updateOne(
    { username: req.session.username },
    {
      $pull: {
        "categories.$[].category.$[cat].groupTodo": { _id: todoId },
      },
    },
    {
      arrayFilters: [{ "cat._id": categoryId }],
    },
  ));
  return deleteTodo;
}
router.post("/DeleteTodo", async (req, res) => {
  const { todoId, categoryId } = req.body;
  const updateTodo = await deleteTodo(req, todoId, categoryId);
  if (!updateTodo) return res.status(401).json("Cant delete todo");

  const category = await getCategoryWithId(req, categoryId);
  return res.status(200).json(category);
});

async function changeFinishedState(req, todoId, categoryId, todoFinished) {
  const changeTodoState = !!(await Group.updateOne(
    { username: req.session.username },
    {
      $set: {
        "categories.$[].category.$[cat].groupTodo.$[todo].finished":
          todoFinished,
      },
    },
    {
      arrayFilters: [{ "cat._id": categoryId }, { "todo._id": todoId }],
    },
  ));
}
router.post("/ChangeFinished", async (req, res) => {
  const { todoId, categoryId, todoFinished } = req.body;

  const changeTodoState = changeFinishedState(
    req,
    todoId,
    categoryId,
    todoFinished,
  );

  if (!changeTodoState) return res.status(401).json("Cant change todo state");
  const category = await getCategoryWithId(req, categoryId);
  return res.status(200).json(category);
});

async function editTodo(req, todo, categoryId) {
  const edited = !!(await Group.updateOne(
    { username: req.session.username },
    {
      $set: {
        "categories.$[].category.$[cat].groupTodo.$[todo].title": todo.title,
        "categories.$[].category.$[cat].groupTodo.$[todo].importancy":
          todo.importancy,
        "categories.$[].category.$[cat].groupTodo.$[todo].dueTime":
          todo.dueTime,
      },
    },
    {
      arrayFilters: [{ "cat._id": categoryId }, { "todo._id": todo._id }],
    },
  ));
  return edited;
}
router.post("/EditTodo", async (req, res) => {
  const { todo, categoryId } = req.body;
  console.log(todo);
  const editedTodo = await editTodo(req, todo, categoryId);
  if (!editedTodo) return res.status(401).json("Cant edit todo");
  const category = await getCategoryWithId(req, categoryId);
  return res.status(200).json(category);
});
module.exports = router;
