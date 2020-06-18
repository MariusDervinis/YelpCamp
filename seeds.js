var mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://admin:baronka122@yelpcamp-ajn6i.mongodb.net/YelpCamp?retryWrites=true&w=majority", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
//      .then(() => console.log( 'Database Connected' ))
//      .catch(err => console.log( err ));
mongoose.connect(process.env.DATABASE_URI , { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true,useFindAndModify: false});
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{name: "Mountain Top",
	image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	price: Math.floor(Math.random() * 100),
	 description: "High place on a mountain reaching the clouds, beautiful view, lots of nature. Bit rocky.",
	author: {
		id: "5ec696cf9099da0543a142c8",
		username: "Reigny"
	}
	},
 	{name: "Lake View",
	 price: Math.floor(Math.random() * 100),
	image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	description: "This is a beautiful lake view, little bit rocky, but if you go down the hill you can easely swim.",
	 author: {
		id: "5ec696cf9099da0543a142c8",
		username: "Reigny"
	}
	},
 	{name: "Star Tracker", 
	 price: Math.floor(Math.random() * 100),
	image: "https://images.unsplash.com/photo-1542067519-6cd1e217df2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	description: "Beautiful view to the sky, other side beautiful lights from the city, not rocky. ",
	 author: {
		id: "5ec696cf9099da0543a142c8",
		username: "Reigny"
	}
	},
		   ]


function seedDB(){
	//remove all campgrounds
	Comment.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
	console.log("removed comments!");	
		Campground.deleteMany({}, function(err){
	if(err){
		console.log(err);
	}
	console.log("removed campgrounds!");
		//add a few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
			if(err){
				console.log(err)
			} else {
			console.log("added a campground");
			//add a few comments
			// Comment.create(
			// {
			// text: "This place is great, but I wish there was internet",
			// author: "Homer"
			// }, function(err, comment){
			// 	if(err){
			// 		console.log(err)
			// 	} else {
			// 		campground.comments.push(comment);
			// 		campground.save();
			// 		console.log("created new comment")
			// 		}
			// 	}
			// )
			}
		});
	});
	})
	
});

	


}

module.exports = seedDB;