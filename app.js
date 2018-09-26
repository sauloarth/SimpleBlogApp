const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const sanitizer = require("express-sanitizer");

//app config
mongoose.connect("mongodb://localhost/simpleblogapp");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//mongoose config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now()},
});

const Blog = mongoose.model("Blog", blogSchema);

//restful routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!");
        } else {
            res.render("index", {blogs:blogs});
        }
    });
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blogCreated){
        if(err) {
            console.log("Something goes wrong!");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blogFound){
        if(err) {
            console.log("Blog could not to be retryved.");
        } else {
            console.log(blogFound);
            res.render("show", {blogFound: blogFound});
        }
    })
})

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blogToEdit){
        if(err){
            console.log("Error!");
        } else {
            res.render("edit", {blogToEdit: blogToEdit});
        }
    })
})

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blogUpdated){
        if(err) {
            console.log("A error was encountred.");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

app.delete("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitizer(req.body.blog.body);
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err) {
            console.log("Something went wrong!");
        } else {
            res.redirect("/blogs");
        }
    })
})

//listening requests
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog is on-line!");
})