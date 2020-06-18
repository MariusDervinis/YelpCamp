var express = require("express");
router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

///cloudinary
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dxvdituzr', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


///



//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
		   res.flash("error", err)
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
   });
});


//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {

    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    // add cloudinary url for the image to the campground object under image property
    var image = result.secure_url;
    var desc = req.body.description;
    // add author to campground
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price:price, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
			res.flash("error", err)
            console.log(err);
        } else {
            //rediret back to campgrounds page
			req.flash("success", "Campground created!");
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
});
});
});


//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
        } else {
            //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
        }
   });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
	});
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
		   res.flash("error", err)
        res.redirect("/campgrounds");
       } else {
		req.flash("success", "Campground updated!");
           //redirect somewhere(show page)
        res.redirect("/campgrounds/" + req.params.id);
       }
	});
});


// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
		  res.flash("error", err)
        res.redirect("/campgrounds");
      } else {
		req.flash("success", "Campground removed!");
        res.redirect("/campgrounds");
      }
   });
});




module.exports = router;