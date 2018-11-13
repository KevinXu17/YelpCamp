 var express = require("express")
 var router = express.Router();
 var Campground = require("../models/campground")
 var Comment = require("../models/comment")
 // INDEX show all campgrounds
    router.get("/", function(req, res) {
           // get all campgrounds from db
           Campground.find({}, function(err, Allcampgrounds) {
               if (err) {
                   console.log(err);
               }else {
                   res.render("campgrounds/index", {
                       campgrounds: Allcampgrounds
                   });
               }
           })
    });
    // NEW: show the form data
    router.get("/new", function(req, res) {
        res.render("campgrounds/new");
    })
    
    // CREATE: where allow u to change campgournds make a new campgrounds
    router.post("/", function(req, res) {
        // get data from form and add to campgronds array
        //redirect back to campground page
        //res.send("!!!!!");
        var name = req.body.name;
        var image = req.body.image;
        var description = req.body.description;
        var newCampGround = {name: name,
                             image: image,
                             description: description
        };
        Campground.create(newCampGround, function(err, newCamp) {
            if (err) {
               alert(err);
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
               console.log(err);
           } else {
               console.log(foundCampground)
               res.render("campgrounds/show", {campground: foundCampground});
           }
        });
        // render the id campgroud
       // res.send("show");
    })
    
    module.exports = router;
    