const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// INDEX ROUTE 

  router.get("/",wrapAsync(listingController.index));
  
// NEW ROUTE 
  
  router.get("/new" , isLoggedIn , listingController.new);
  
// SHOW ROUTE 
  
  router.get("/:id" , wrapAsync(listingController.showListing));
  
// CREATE ROUTE
  
  router.post("/" , isLoggedIn, upload.single('listing[image]'),  validateListing , wrapAsync(listingController.createListings));
  
// EDIT ROUTE 
  
  router.get("/:id/edit" , isLoggedIn , isOwner ,  wrapAsync (listingController.editform));
  
//UPDATE ROUTE 
  
  router.put("/:id" , isLoggedIn , isOwner, upload.single('listing[image]'), validateListing , wrapAsync (listingController.updateListings));
  
// DELETE ROUTE 
  
  router.delete("/:id" ,isLoggedIn,isOwner, wrapAsync(listingController.deleteListings));

  module.exports = router;