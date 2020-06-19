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
        req.fileValidationError = "Forbidden extension";
        return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: "dxvdituzr", 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


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
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    if(req.fileValidationError){
        req.flash("error", "Only image files are allowed!"); 
        return res.redirect("back");
    } else {

        cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
            if(err) {
              req.flash('error', err.message);
              return res.redirect('back');
            }
            // add cloudinary url for the image to the campground object under image property
            req.body.campground.image = result.secure_url;
            // add image's public_id to campground object
            req.body.campground.imageId = result.public_id;
            // add author to campground
            req.body.campground.author = {
              id: req.user._id,
              username: req.user.username
            }

            Campground.create(req.body.campground, function(err, campground) {
              if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
              }
              req.flash('success', campground.name + " created!");
              console.log("New campground: " + campground)
              res.redirect('/campgrounds/' + campground.id);
              
            });
          });
    }

});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash('error', err.message);
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            req.flash('error', err.message);
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", upload.single('image'), function(req, res){
    if(req.fileValidationError){
        req.flash("error", "Only image files are allowed!"); 
        return res.redirect("back");
    } else {
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.name;
            campground.price = req.body.price;
            campground.description = req.body.description;
            campground.save();
            req.flash("success", campground.name + " successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
}});

router.delete('/:id', function(req, res) {
  Campground.findById(req.params.id, async function(err, campground) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(campground.imageId);
        campground.remove();
        req.flash('success', 'Campground deleted successfully!');
        res.redirect('/campgrounds');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

module.exports = router;