require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10


let ejs = require('ejs')

const app = express()
const port = 3000

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//   res.render('index', {foo: 'FOO'});
// });

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema= new mongoose.Schema({
    email:String,
    password:String,
    firstName:String,
    secondName:String,
    phone:Number
});



const User = new mongoose.model("User",userSchema);

app.get('/', (req, res) => res.sendFile(__dirname+"/signup.html"));
app.get('/login', (req, res) => res.sendFile(__dirname+"/login.html"));

app.post("/signup.html",function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const email = req.body.email;
        // Store hash in your password DB.
        const newUser = new User({
            email : req.body.email,
            password : hash,
            firstName :req.body.fname,
            secondName : req.body.lname,
            phone : req.body.phoneNumber

    });
    

    User.findOne({email:req.body.email},function(err,foundUser){
       
        if(err){
            console.log(err);
            
        }else{
            if(foundUser){
                   console.log("Email already exist!!");
                  
            }else{

                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        
                    }else{
                        res.sendFile(__dirname+"/login.html");
                    }
                });
            }   
        } 
    });
      });

    

    
});

  

app.post("/login.html",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    

    User.findOne({email:email},function(err,foundUser){
        if(err){
            console.log(err);
            
        }else{
            if(foundUser){
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    if(result == true){
                        res.render('index', {name: foundUser.firstName,email: foundUser.email});
                    }else{
                        console.log("password error ");
                    }
                });   
                    
                    
                
            }else{
                console.log("No such user in database");
                
            }
        }
    });
    
    
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))