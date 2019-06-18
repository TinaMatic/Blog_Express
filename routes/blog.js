var express    = require("express");
var router     = express.Router();
var Blog       = require("../models/blog");
var middleware = require("../middleware/index");

//INDEX route
router.get("/blogs", function(req, res){
    //find all blogs from database
    Blog.find({}, function(err, allBlogs){
       if(err){
           console.log(err);
           res.redirect("/");
       } 
       else{
           //show all the blogs
           res.render("blogs/index", {blogs: allBlogs});
       }
    });
});

//NEW route
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
   res.render("blogs/new"); 
});

//CREATE route
router.post("/blogs", middleware.isLoggedIn, function(req, res){
   //create a blog using the info from the form
   var newBlog = {
       title: req.body.title,
       image: req.body.image,
       body: req.body.body,
       author: {
           id: req.user._id,
           username: req.user.username
       }
   };
   Blog.create(newBlog, function(err){
      if(err){
          console.log(err);
      } 
      else{
          req.flash("success", "Blog successfully created");
          res.redirect("/blogs");
      }
   });
});

//SHOW route
router.get("/blogs/:id", function(req, res) {
   //find the blog to show
   Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
       if(err){
           console.log(err);
       }
       else{
           res.render("blogs/show", {blog: foundBlog});
       }
   });
});

//EDIT route
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function(req, res) {
    //find the particular form
    Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          console.log(err);
      } 
      else{
            res.render("blogs/edit", {blog: foundBlog}); 
      }
    });
  
});

//UPDATE route
router.put("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
   //find and update the blog
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog ){
      if(err){
          console.log(err);
      } 
      else{
          res.redirect("/blogs/"  + req.params.id);
      }
   });
});

//DESTROY route
router.delete("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
    //find the blog and delete it
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        else{
            req.flash("success", "Blog successfully deleted");
            res.redirect("/blogs");
        }
    });
});

module.exports = router;