var express          = require("express");
var app              = express();
var mongoose         = require("mongoose");
var bodyParser       = require("body-parser");
var methodOverride   = require("method-override");
var passport         = require("passport");
var LocalStrategy    = require("passport-local");
var Blog             = require("./models/blog");
var User             = require("./models/user");
var Comment          = require("./models/comment");
var flash            = require("connect-flash");

//require routes
var blogRoutes       = require("./routes/blog");
var commentRoutes    = require("./routes/comment");
var indexRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/blog", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"This is a secrect code for the blog app",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set the user for every route to use
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
});

//root route
app.get("/", function(req, res){
    res.render("landing");
});

//use the routes
app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT, process.env.IP);