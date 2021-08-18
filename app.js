require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;
const saltRound = 10;
const app = express();
var error = "";

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new schema ({
email : String,
password : String
});
const user = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login",{message :error});
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){

  bcrypt.hash(req.body.password,saltRound,function(err,hash){
     const usr = new user({
      email:req.body.username,
      password: hash
    });
    usr.save(function(err){
      if(err){
        res.redirect("/register");
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
  })


});

app.post("/login",function(req,res){
  let password=req.body.password;
  let email= req.body.username;
  user.findOne({email : email},function(err,docs){
    if(err || !docs){
      error = "incorrect email or password ! ";
     res.redirect("/login");
    }else{
      bcrypt.compare(password,docs.password,function(err,result){
        if(result==true){
          res.render("secrets");
        }else{
           error = "incorrect email or password ! ";
          res.redirect("/login");
        }
      })
    }
  })


})





app.listen(3000,function(){

  console.log("server running on port 3000.");
})
