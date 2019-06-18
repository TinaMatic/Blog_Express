var express     = require("express");
var router      = express.Router();
var Blog        = require("../models/blog");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

//==============
//COMMENT routes
//==============

//NEW route
router.get("/blogs/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find the blog by id to have the comment
    Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
           req.flash("error", "Blog not found");
       }
       else{
            res.render("comments/new", {blog: blog});   
       }
    });
});

//CREATE route
router.post("/blogs/:id/comments", middleware.isLoggedIn, function(req, res){
    //found the blog by id
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }
                else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    
                    //save comment
                    comment.save();
                    
                    //connect new comment to blog
                    blog.comments.push(comment);
                    blog.save();
                    
                    //redirect to show page
                    req.flash("success", "Successfully added comment");
                    res.redirect("/blogs/" + blog._id);
                }
            });
        }
    });
});

//EDIT route
router.get("/blogs/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          console.log(err);
      } 
      else{
          res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
      }
   }); 
});

//UPDATE route 
router.put("/blogs/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           console.log(err);
           res.redirect("back");
       }
       else{
           res.redirect("/blogs/" + req.params.id);
       }
   }); 
});

//DESTROY route
router.delete("/blogs/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success", "Successfully deleted a comment");
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = router;