const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// desc: Register new user
// routes: POST /api/user,
// access: public

const registerUser = asyncHandler(async (req, res) => {
  // distructure it
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please fill in the tex fild");
  }

  // check if user exist
  const userExist = await User.findOne({ email });
  // validation
  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  // hash my pasword
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //  create user
  const user = await User.create({ name, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
// desc: Authenticate or login a user
// routes: POST /api/user/login,
// access: public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});
// desc: Get all user data
// routes: GET /api/user/me,
// access: private

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});
//generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
