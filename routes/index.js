var express   = require("express");
var router    = express.Router();
var passport  = require("passport");
var User      = require("../models/user");

//===========
//AUTH ROUTES
//===========

//show the sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle the sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the Blog " + user.username);
            res.redirect("/blogs");     
        });
    });
});

//show to login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handle login logic
router.post("/login", passport.authenticate("local", 
    {   
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res){
        
});

//logout logic
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Successfully logged you out")
   res.redirect("/blogs");
});

module.exports = router;