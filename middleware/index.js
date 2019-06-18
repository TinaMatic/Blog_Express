var Blog    = require("../models/blog");
var Comment = require("../models/comment");

//create a middleware object that will hold all the middleware
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next){
    //check if user is logged in
    if(req.isAuthenticated()){
        //find the requested blog
        Blog.findById(req.params.id, function(err, foundBlog){
           if(err){
               req.flash("error", "Blog not found");
               res.redirect("back");
           } 
           else{
               //does the user own a blog?
               if(foundBlog.author.id.equals(req.user._id)){
                   next();
               }
               else{
                   //doesn't have the permission
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }
           }
        });
    }
    else{
        //need to be logged in to do that
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //check if user is logged in
    if(req.isAuthenticated()){
        //find the requested comment
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }
           else{
               //check if the user owns a comment
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               }
               else{
                   //doesn't have the permission
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }
           }
        });
    }
    else{
        //need to be logged in to do that
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;