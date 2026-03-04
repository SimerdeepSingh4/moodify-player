const express = require('express');
const authRouter = express.Router();
const authController = require('../controller/auth.controller');
const authUser = require('../middleware/auth.middleware');

authRouter.post("/register", authController.registerController)
authRouter.post("/login", authController.loginController)
authRouter.get("/get-me", authUser, authController.getMe)
authRouter.get("/logout", authUser, authController.logoutController)


module.exports = authRouter;