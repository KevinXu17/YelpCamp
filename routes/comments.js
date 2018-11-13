  var express = require("express")
  var router = express.Router({mergeParams: true});  //<----- this avoid id to be cover
  var Campground = require("../models/campground")
  var Comment = require("../models/comment")
 // COMMETNS ROUTES
    // NEW
    router.get("/new", isLoggedIn, function(req, res) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                console.log(err)
            }else {
                 res.render("comments/new", {campground: campground});
            }
        })
    })
    // CREATE
    router.post("/", isLoggedIn, function(req, res) {
        // lookup campground by id
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log(err)
                res.redirect("/campgrounds/"+ foundCampground._id +"/comments/new")
            }else {
                // create new comment
                Comment.create(req.body.comment, function(err, newComment) {
                    if (err) {
                        console.log(err)
                    } else {
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
    
        // check login
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login")
    }
    
        module.exports = router;