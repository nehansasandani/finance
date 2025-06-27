const express = require('express');
const { registerUser, fetchUsersCtrl, loginUserCtrl,updateUserCtrl } = require('../../controllers/users/usersCtrl.js');

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUserCtrl);
userRoute.get("/", fetchUsersCtrl);
userRoute.put("/:id", updateUserCtrl);

module.exports =userRoute;