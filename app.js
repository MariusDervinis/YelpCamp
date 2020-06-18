//requiring environment variables with dotenv
	require('dotenv').config();

var express = require("express"),
 	app = express(),
 	bodyParser = require("body-parser"),
 	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	
	seedDB = require("./seeds"),
	Comment = require("./models/comment"),
	Campground = require("./models/campground"),
	User = require("./models/user");

//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");
	
//Seeding the database to work with
//WARNING: IT WILL DELETE AND REPLACE WITH DUMMY DATA EVERYTIME APP RESTARTS!!
//seedDB();

app.set("view engine", "ejs");

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true,useFindAndModify: false});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASPORT CONFIG
app.use(require("express-session")({
	secret: "Thats the secret for the password lul!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//ROUTER
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/", campgroundRoutes);

//links and data for laterz
// var campgrounds = [
// 		{name: "Mountain Top", image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Lake View", image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Star Tracker", image: "https://images.unsplash.com/photo-1542067519-6cd1e217df2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 			{name: "Mountain Top", image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Lake View", image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Star Tracker", image: "https://images.unsplash.com/photo-1542067519-6cd1e217df2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 			{name: "Mountain Top", image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Lake View", image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 		{name: "Star Tracker", image: "https://images.unsplash.com/photo-1542067519-6cd1e217df2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
// 	];


app.listen(process.env.PORT, function(){
	console.log("YelpCamp server has started!")
});
