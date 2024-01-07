const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.get("/signup" , userController.rendersignup);

router.post("/signup" , wrapAsync(userController.signup));

router.get("/login" ,userController.renderlogin);

router.post(
    "/login" , 
    saveRedirectUrl , 
    passport.authenticate("local" , {
        failureRedirect : "/login" ,
         failureFlash : true
    }) , userController.login
);

router.get("/logout" , userController.logout);

module.exports = router;