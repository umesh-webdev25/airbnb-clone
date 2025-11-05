const express = require('express');
const userRouter = express.Router();
const controller = require('../controller/home');
const submit = require('../controller/submit');
const { requireAdmin } = require('../middleware/auth');

// Fix route path 👇
userRouter.get("/index", requireAdmin, controller.addhome); // Only admins can access
userRouter.get("/", controller.index);
userRouter.get("/submit", submit.submit);
module.exports = userRouter;
