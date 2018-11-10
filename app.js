    var app = require("express")();
    var bodyParser = require("body-parser")
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/yelpcamp_app");
    var Campground = require("./models/campground");
    var Comment = require("./models/commment");
    var User = require("./models/user");



 
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
                   res.render("index", {campgrounds: Allcampgrounds});
               }
           })
    });
    // NEW: show the form data
    app.get("/campgrounds/new", function(req, res) {
        res.render("new.ejs");
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
        Campground.findById(req.params.id, function(err, foundCampground) {
           if (err) {
               alert(err);
           } else {
               res.render("show", {campground: foundCampground});
           }
        });
        // render the id campgroud
       // res.send("show");
    })
    
    app.listen(process.env.PORT, process.env.IP, function() {
        console.log("Server is Open!");
    });