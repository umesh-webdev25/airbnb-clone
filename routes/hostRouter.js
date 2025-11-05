const express = require('express');
const hostRouter = express.Router();
const controller = require('../controller/home');
const aboutcontroller = require('../controller/about')
const updatecontroller = require('../controller/update')
const { validateRegistration } = require('../middleware/validation');

// NOTE: hostRouter is mounted at /host in app.js
hostRouter.get('/home', controller.showdetail);  // List all
hostRouter.post('/home', controller.upload.single('profileImage'), validateRegistration, controller.adddetails); // Add new with file upload
hostRouter.get('/home/:id', controller.showdetailbyid); // Show single
hostRouter.get('/editing/:id', controller.editing); // Edit form
hostRouter.post('/editing/update', controller.upload.single('profileImage'), controller.update); // Update with file upload
hostRouter.post('/delete/:id', controller.delete);  
hostRouter.get('/about', aboutcontroller.about); 
hostRouter.get('/update', updatecontroller.update);
module.exports = hostRouter;
