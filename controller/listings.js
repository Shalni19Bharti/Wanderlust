const Listing = require("../models/listing.js");

module.exports.index = async (req,res) => {
    const datas = await Listing.find({});
    res.render("./listings/index.ejs" , {datas});
};

module.exports.new =  (req,res) => {
    res.render("./listings/new.ejs")
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params ;
    const allData = await Listing.findById(id)
    .populate({
        path : "reviews" ,
        populate : {
            path : "author" ,
        },
    })
    .populate("owner");
    if(!allData) {
        req.flash("error" , "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(allData);
    res.render("listings/show.ejs" , {allData});
};

module.exports.createListings = async (req,res,next) => {
    let url = req.file.path ;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    newListing.image = {url , filename};   
    await newListing.save();
    req.flash("success" , "New Listings Created");
    res.redirect("/listings");
};

module.exports.editform = async (req, res) => {
    let {id} = req.params ; 
    const allData = await Listing.findById(id);
    if(!allData){
      req.flash("error" , "Listing does not exist");
      res.redirect("/listings");
    }
    let originalImage = allData.image.url;
    originalImage = originalImage.replace("w=800" , "w=200");
    originalImage = originalImage.replace("/upload" , "/upload/w_300");
    res.render("./listings/edit.ejs" , {allData , originalImage});
};

module.exports.updateListings = async(req , res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path ;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }

    req.flash("success" , "Listings Updated! ");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListings = async (req,res) => {
    let {id} = req.params;
    let deletedItem = await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    req.flash("success" , "Listings Deleted");
    res.redirect("/listings");
};