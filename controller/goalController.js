const asyncHandler = require("express-async-handler");
const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// desc: get goals
// routes: Get/api/goals,
// access: private
// get your own goal
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });

  res.status(200).json(goals);
});
// desc: get goals
// routes: Get/api/goals,
// access: private

const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("please add a text field");
  }
  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });
  res.status(200).json(goal);
});
// desc: get goals
// routes: Get/api/goals,
// access: private

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("Goal not found");
  }

  // check for user
  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
  }
  // make sure you dont update each others goal
  // make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }
  // for the put specifically
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});
// desc: get goals
// routes: Get/api/goals,
// access: private

const deleteGoal = asyncHandler(async (req, res) => {
  // find by id first before deleting
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    console.log("no goal found");

    res.status(400);
    throw new Error("goal not found");
  }

  const useer = await User.findById(req.user.id);
  // check for user
  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
  }
  // make sure you dont update each others goal
  // make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }
  await goal.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = { getGoals, setGoal, updateGoal, deleteGoal };
