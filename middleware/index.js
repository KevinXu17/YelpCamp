// all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground")
  var Comment = require("../models/comment")
middlewareObj.isLoggedIn = 
        // check login
    function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "Please Login First!")
        res.redirect("/login");
    }

middlewareObj.checkCommentOwnership = 
            // check owner
    function (req, res, next) {
         if (req.isAuthenticated()) {
                Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("/campgrounds")
            }else {
                // check owner
                if (foundComment.author.id.equals(req.user._id)){
                    return next();
                }else {
                    res.redirect("back")
                }
            }
        })
        } else {
            req.flash("error", "Please Login First.")
            res.redirect("back")
        }
    }


middlewareObj.checkCampgroundOwnership = 
        // check owner
    function (req, res, next) {
         if (req.isAuthenticated()) {
                Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found.")
                res.redirect("/campgrounds")
            }else {
                // check owner
                if (foundCampground.author.id.equals(req.user._id)){
                    return next();
                }else {
                    res.redirect("back")
                }
            }
        })
        } else {
            req.flash("error", "You don't have permission to do that.")
            res.redirect("back")
        }
    }
    






module.exports = middlewareObj;