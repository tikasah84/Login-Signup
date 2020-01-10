const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const mongoose = require('mongoose')
var encrypt = require('mongoose-encryption');

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


const secret ="secret";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});
const User = new mongoose.model("User",userSchema);

app.get('/', (req, res) => res.sendFile(__dirname+"/signup.html"));
app.get('/login', (req, res) => res.sendFile(__dirname+"/login.html"));

app.post("/signup.html",function(req,res){

    const newUser = new User({
            email : req.body.email,
            password : req.body.password,
            firstName :req.body.fname,
            secondName : req.body.lname,
            phone : req.body.phoneNumber

    });
    newUser.save(function(err){
        if(err){
            console.log(err);
            
        }else{
            res.sendFile(__dirname+"/login.html");
        }
    });
});

app.post("/login.html",function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const firstName =req.body.fname;
    const secondName = req.body.lname;
    const phone = req.body.phoneNumber;

    User.findOne({email:email},function(err,foundUser){
        if(err){
            console.log(err);
            
        }else{
            if(foundUser){
                if(foundUser.password === password){
                   // res.sendFile(__dirname+"/homePage.html");
                    res.render('index', {name: foundUser.firstName,password: foundUser.password});
                }else{
                    console.log("password error ");
                    
                    
                }
            }else{
                console.log("No such user in database");
                
            }
        }
    });
    
    
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))