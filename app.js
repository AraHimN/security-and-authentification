require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const schema = mongoose.Schema;
const app = express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new schema ({
email : String,
password : String
});

userSchema.plugin(encrypt,{secret : process.env.SECRET,encryptedFields :["password"]});
const user = mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
const usr = new user({
  email:req.body.username,
  password: req.body.password
});
  usr.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req,res){
  let email= req.body.username;
  let password= req.body.password;
  user.find({email : email ,paord : password},function(err,docs){
    if(err){
      console.log(err.message);
    }else{
      if(docs.length === 0){
        console.log("email or password incorrect");
      }else{
          console.log(docs);
      }

    }
  })
})





app.listen(3000,function(){

  console.log("server running on port 3000.");
})
