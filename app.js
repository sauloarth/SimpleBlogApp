const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//app config
mongoose.connect("mongodb://localhost/simpleblogapp");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

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
})

//listening requests
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog is on-line!");
})