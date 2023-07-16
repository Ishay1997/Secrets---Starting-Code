//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



// s3.getBucketCors({Bucket: process.env.}, function(err, data) {})

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



const app = express();

console.log(process.env.SECRET);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"] });


const User = new mongoose.model("User", userSchema);

app.get("/",function(req, res){
  res.render("home");
});
app.get("/login",function(req, res){
  res.render("login");
});
app.get("/register",function(req, res){
  res.render("register");
});


// app.post("/register", function(req, res) {
//   const newUser = new User({
//     email: req.body.username,
//     password: req.body.password
//   });
//   newUser.save(function(err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("s");
//     }
//   });
// });


app.post("/register", async function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  try {
    await newUser.save();
    res.render("s");
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ email: username });
    if (foundUser && foundUser.password === password) {
      res.render("s");
    }
  } catch (err) {
    console.log(err);
  }
});




app.listen(3000, function(){
  console.log("starting ti run 3000");
})
