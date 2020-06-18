var express = require("express"),
 	router = express.Router({mergeParams: true}),
	passport = require("passport"),
	User = require("../models/user");


//root route
router.get("/", function (req, res) {
  res.render("landing");
});

//=============
//AUTH ROUTES

//show register form
router.get("/register", function (req, res) {
  res.render("register");
});
//handle sign up logicv
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
		req.flash("success", "Welcome to YelpCamp, " + user.username)
      res.redirect("/campgrounds");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});



//handling login post
// router.post(
//   "/login",
//   passport.authenticate("local", { 	successRedirect: "/campgrounds",
// 								 	failureRedirect: "/login",
// 									failureFlash: "Invalid username or password.", 
// 									successFlash: "Welcome back, "
//   								}
// 					   ),
//   function (req, res) {
//     req.session.returnTo;
//   }
// );

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req,res) => {
       req.flash("success", "Welcome back, " + req.body.username)
       res.redirect("/campgrounds");
    });






//logout route
router.get("/logout", function (req, res) {
	req.logout();
	req.flash("success", "Logged you out. See you soon!"); 
	res.redirect("/campgrounds");
});


module.exports = router;
