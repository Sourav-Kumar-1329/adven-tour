var express = require ("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
    User = require("./models/user"),
	seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb+srv://sourav:sourav132907@cluster0-9wojo.mongodb.net/<dbname>?retryWrites=true&w=majority",{
	useNewParser: true,
	useCreateIndex: true
}),then(()=>{
	console.log("connected to DB!")
}).catch(err => {
	console.log("Error",err.message);
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

app.use(require("express-session")({
	secret:"Rusty wins again",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	// res.locals.message = req.flash("error");
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});