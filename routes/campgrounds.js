var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/campground",function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if (err){
			console.log(err);
		}else{
			res.render("index",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	});	
});

router.post("/campground",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name : name,price : price, image : image, description: desc, author : author};
	Campground.create(newCampground,function(err,newmlyCreated){
		if (err){
			console.log(err);
		}else{
			res.redirect("/campground");
		}
	});
});

router.get("/campground/new",middleware.isLoggedIn,function(req,res){
	res.render("new");
})

router.get("/campground/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if (err){
			console.log(err);
		}else{
			res.render("show",{campground:foundCampground});
		}
	});
});

router.get("/campground/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findById(req.params.id, function(err, foundCampground){
				res.render("edit", { campground: foundCampground});
		});	
});

router.put("/campground/:id",middleware.checkCampgroundOwnership,function(req,res){	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campground");
		}else{
			res.redirect("/campground/" + req.params.id);
		}
	});
});

router.delete("/campground/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campground");
		}else{
			res.redirect("/campground");
		}
	});
});

module.exports = router;