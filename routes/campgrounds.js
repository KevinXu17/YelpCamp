 var express = require("express")
 var router = express.Router();
 var Campground = require("../models/campground")
 var Comment = require("../models/comment")
 var middlewareObj = require("../middleware")
 // INDEX show all campgrounds
    router.get("/", function(req, res) {
           // get all campgrounds from db
           Campground.find({}, function(err, Allcampgrounds) {
               if (err) {
                   req.flash("error", "Not campgrounds can found")
                   console.log(err);
               }else {
                   res.render("campgrounds/index", {
                       campgrounds: Allcampgrounds
                   });
               }
           })
    });
    // NEW: show the form data
    router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
        res.render("campgrounds/new");
    })
    
    // CREATE: where allow u to change campgournds make a new campgrounds
    router.post("/", middlewareObj.isLoggedIn, function(req, res) {
        // get data from form and add to campgronds array
        //redirect back to campground page
        //res.send("!!!!!");
        var name = req.body.name;
        var image = req.body.image;
        var price = req.body.price;
        var description = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        var newCampGround = {name: name,
                             price: price,
                             image: image,
                             description: description,
                             author: author
        };
        Campground.create(newCampGround, function(err, newCamp) {
            if (err) {
                req.flash("error", "Can not make a new campground, please try again.")
               console.log(err);
            } else {
                console.log("make a new campgournd");
                console.log(newCamp)
                        res.redirect("/campgrounds"); // here is the web not file
            }
        });        
    });
    
    // SHOW
    router.get("/:id", function(req, res) {
        // find campgroud with id
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
           if (err) {
               req.flash("error", "Campground can not found.")
               console.log(err);
           } else {
               console.log(foundCampground)
               res.render("campgrounds/show", {campground: foundCampground});
           }
        });
        // render the id campgroud
       // res.send("show");
    })
    
    // EDIT Campground
    router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res) {
                Campground.findById(req.params.id, function(err, foundCampground) {
                    res.render("campgrounds/edit", {campground: foundCampground})
                })
    })
    // UPDATE Campground
    router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
        // find and update campground
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, 
        function(err, updateCampground){
            if (err) {
                req.flash("error", "Can not update campground, please try again.")
                console.log(err)
                res.redirect("/campgrounds")
            }else {
                req.flash("success", "Campground updated.")
                res.redirect("/campgrounds/" + req.params.id);
            }
        })
        // redirect show page
    })
    
    // DESTORY
    router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
        //findId and remove
        Campground.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                req.flash("error", "Can not remove campground, please try again")
                console.log(err);
                res.redirect("/campgrounds")
            } else {
                req.flash("success", "Campground deleted.")
                 res.redirect("/campgrounds")
            }
        })
    })
    

    

    module.exports = router;
    