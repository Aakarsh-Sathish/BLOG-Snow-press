const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  date:Date,
  content: String
};

const UserSchema = {
  username: String,
  password: String
};

const User = mongoose.model("User", UserSchema); 
const Post = mongoose.model("Post", postSchema);

var posts = [];
var admin = 
  {
    username:"Aakarsh",
    password:"123456789"
  };
var readers = [];

app.get("/", function (req, res) {
  res.render("index", {});
});


app.get("/hotel", function (req, res) {
  res.render("hotel", {});
});

app.get("/login", function (req, res) {
  res.render("login", {});
});

app.get("/sign_in", function (req, res) {
  res.render("sign_in", {});
});


app.get("/compose", function (req, res) {
  res.render("compose", {});
});

app.get("/blog", function (req, res) {
  Post.find({}, function(err, posts){
    res.render("blog", {  
      posts: posts
      });
});
});
/*
app.post("/login", function (req, res) {
  var login = {
    username: req.body.email,
    password: req.body.password
  };

  if(login.username == admin.username && login.password == admin.password)
  {
    res.redirect("/compose")
  }
  else{
    readers.push(signin)
    res.redirect("/")
  }
console.log(readers)

});

*/

app.post("/sign_in", function (req, res) {
  const cred = new User ({
    username: req.body.email,
    password: req.body.password,
  });

  cred.save();
  res.redirect("/login");
});




app.post("/compose", function (req, res) {
  const post = new Post ({
    title: req.body.postTitle,
    date: req.body.date,
    content: req.body.postBody
  });

  post.save();

    var temp = {
      title: req.body.Title,
      date: req.body.date,
      blog: req.body.blogpost,  
    };
  posts.push(temp);
  
  res.redirect("/blog");
});

app.post("/login", function (req, res) {
  var login = {
    username: req.body.email,
    password: req.body.password
  };

  if(login.username == admin.username && login.password == admin.password)
  {
    res.redirect("/compose")
  }
  else
  {
    User.find({username:login.username},{password:login.password}, function(err, result){
      if(result.length == 0)
      {
        res.redirect("/login")
      }
      else
      {
        console.log("result " , result)
        res.redirect("/")
      }

    });
  }
console.log("readers " , readers)



});





app.get("/posts/:postname", function (req, res) {
  const posttitle = _.lowerCase(req.params.postname);
  for (var i = 0; i < posts.length; i++) {
    const storedTitle = _.lowerCase(posts[i].title);
    if (posttitle === storedTitle) {
      console.log("Match found");
    }
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
