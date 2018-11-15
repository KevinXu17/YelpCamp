    var express       = require("express")
    var app           = express();
    var bodyParser    = require("body-parser")
    var mongoose      = require("mongoose");
    var Campground    = require("./models/campground");
    var Comment       = require("./models/comment");
    var User          = require("./models/user");
    var seedDB        = require("./seeds")
    var passport      = require("passport")
    var LocalStrategy = require("passport-local")
    var flash         = require("connect-flash")
    
    var commentRoutes = require("./routes/comments")
    var campgroudRoutes= require("./routes/campgrounds")
    var indexRoutes    = require("./routes/index")
    
    var methodOverride = require("method-override")
    
    
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
    mongoose.connect("mongodb://localhost/yelpcamp_app_3");
    
    app.use(express.static(__dirname + "/public"))
    app.use(methodOverride("_method"))
    app.use(flash())
   // seedDB();
    
    // PASSPORT CONFIGURATION
    app.use(require("express-session")({
        secret: "What do you want",
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
        
   // this must after all of above        
    app.use(function(req, res, next){   // add currentuser to all rout
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error")
        res.locals.success = req.flash("success") 
        next();
    })
   
  app.use(indexRoutes);
  app.use("/campgrounds", campgroudRoutes); // make all campground routes with predix /campgrounds that
                                            // campgrounds routes dont need to have it all 
  app.use("/campgrounds/:id/comments", commentRoutes)
    

    app.listen(process.env.PORT, process.env.IP, function() {
        console.log("Server is Open!");
    });