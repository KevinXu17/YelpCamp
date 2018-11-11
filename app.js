    var express = require("express")
    var app = express();
    var bodyParser = require("body-parser")
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/yelpcamp_app_3");
    var Campground = require("./models/campground");
    var Comment = require("./models/comment");
    var User = require("./models/user");
    var seedDB = require("./seeds")
    app.use(express.static(__dirname + "/public"))

    seedDB();

 
    app.get("/", function(req, res){
        res.render("landing");
    });
    
    // INDEX show all campgrounds
    app.get("/campgrounds", function(req, res) {
           // get all campgrounds from db
           Campground.find({}, function(err, Allcampgrounds) {
               if (err) {
                   console.log(err);
               }else {
                   res.render("campgrounds/index", {campgrounds: Allcampgrounds});
               }
           })
    });
    // NEW: show the form data
    app.get("/campgrounds/new", function(req, res) {
        res.render("campgrounds/new");
    })
    
    // CREATE: where allow u to change campgournds make a new campgrounds
    app.post("/campgrounds", function(req, res) {
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
    app.get("/campgrounds/:id", function(req, res) {
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
    
    // COMMETNS ROUTES
    // NEW
    app.get("/campgrounds/:id/comments/new", function(req, res) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                console.log(err)
            }else {
                 res.render("comments/new", {campground: campground});
            }
        })
    })
    // CREATE
    app.post("/campgrounds/:id/comments", function(req, res) {
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
    
    app.listen(process.env.PORT, process.env.IP, function() {
        console.log("Server is Open!");
    });