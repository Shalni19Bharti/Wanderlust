const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErrror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{validateReview, isLoggedIn , isAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

// REVIEWS ROUTE
// POST REVIEWS ROUTE

router.post("/" ,isLoggedIn, validateReview , wrapAsync (reviewController.createReview)) ; 
  
  // DELETE REVIEWS ROUTE
  
router.delete("/:reviewId" ,isLoggedIn , isAuthor , wrapAsync(reviewController.deleteReview));

module.exports = router ;