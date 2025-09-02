const express = require('express');
const userRouter = express.Router();
const controller = require('../controller/home');
const submit = require('../controller/submit');

// Fix route path 👇
userRouter.get("/index",controller.addhome)
userRouter.get("/", controller.index);
userRouter.get("/submit", submit.submit);
module.exports = userRouter;
