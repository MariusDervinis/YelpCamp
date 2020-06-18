var express = require("express"),
 	router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//===================
// COMMENTS ROUTES
//===================


//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
  //find campground by id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
		req.flash("error", err);
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

//comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
  //lookup campground using id
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
		req.flash("error", err);
      console(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
		req.flash("error", "Something went wrong!");
        console.log(err);
        } else {
			//add username and id to comment
		comment.author.id = req.user._id;
		comment.author.username = req.user.username;
			//save comment
		comment.save();
        campground.comments.push(comment);
        campground.save();
		req.flash("success", "Successfully added comment");
        res.redirect("/campgrounds/" + campground._id);
        }
      });
      // Comments.create({})
    }
  });
  //create new comments//connect new comment to campground
  //redirect to campgrouind showpage
});


//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
Campground.findById(req.params.id, function(err, foundCampground){
	if(err || !foundCampground){
		req.flash("error", "Campground not found");
		res.redirect("back");
	}
	Comment.findById(req.params.comment_id, function(err, foundComment){
	if(err){
		req.flash("error", "You don't have a permission to do that!");
		res.redirect("back")
	} else {
		res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
	}
	});
	});
});
//Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
		req.flash("error", "Campground not found");
		res.redirect("back")
	}
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
		if(err){
			req.flash("error", "You don't have a permission to do that!");
			res.redirect("back");
		} else {
			req.flash("success", "Comment updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
		});
	});
});

//Comment Destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
		req.flash("error", "Campground not found");
		res.redirect("back")
	}
	//find by id and remove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "You don't have a permission to do that!");
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id)
		}
		});
	});
});


module.exports = router;