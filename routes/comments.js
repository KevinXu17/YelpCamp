  var express = require("express")
  var router = express.Router({mergeParams: true});  //<----- this avoid id to be cover
  var Campground = require("../models/campground")
  var Comment = require("../models/comment")
  var middlewareObj = require("../middleware")
 // COMMETNS ROUTES
    // NEW
    router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                req.flash("error", "Campground can not found.")
                console.log(err)
            }else {
                 res.render("comments/new", {campground: campground});
            }
        })
    })
    // CREATE
    router.post("/", middlewareObj.isLoggedIn, function(req, res) {
        // lookup campground by id
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log(err)
                req.flash("error", "Campground can not found.")
                res.redirect("/campgrounds/"+ foundCampground._id +"/comments/new")
            }else {
                // create new comment
                
                Comment.create(req.body.comment, function(err, newComment) {
                    if (err) {
                        req.flash("error", "Can not create a comment, please try again.")
                        console.log(err)
                    } else {
                        // add user name id to comment
                        newComment.author.id = req.user._id;
                        newComment.author.username = req.user.username;
                        newComment.save();
                        foundCampground.comments.push(newComment);
                        foundCampground.save();
                        res.redirect("/campgrounds/" + foundCampground._id)
                    } 
                })
            }
        })
        // create a new comment
        
        // connent new comment to campground
        
        // redirect campground show page
    })
    
    // EDIT comment 
    router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Comment can not found.")
                console.log(err)
                res.redirect("back")
            } else {
                res.render("comments/edit", {campgroundId: req.params.id,
                    comment: foundComment
                })
            }
        })
    })
    
    // UPDATE comment
    router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment) {
            if (err) {
                req.flash("error", "Please try again.")
                console.log(err)
                res.redirect("back")
            } else {
                req.flash("success", "Comment updated.")
                res.redirect("/campgrounds/" + req.params.id)
            }
        })
    })
    // COMMENT DESTROY ROUTE
    router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
        //findByIdAndRemove
        Comment.findByIdAndRemove(req.params.comment_id, function(err) {
            if (err) {
                req.flash("error", "Please try again.")
                console.log(err)
                res.redirect("back")
            } else {
                req.flash("success", "Comment deleted.")
                res.redirect("/campgrounds/" + req.params.id)
            }
        })
    })
    
    // middleWare

    

        module.exports = router;