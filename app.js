const exp = require("constants");
const express=require("express");
const cookieparser= require("cookie-parser");
const app=express();
const port= process.env.PORT||3000;
const hbs=require("hbs");
app.set("view engine","hbs");
const path=require("path");
const user=require("./models/colln");
require("./db/conn");
const parpath=path.join(__dirname,"/partials");
// console.log(parpath);
hbs.registerPartials(parpath);
const multer= require("multer");
const { createtoken,
    validatetoken}= require("./services/stateless");

const bcrypt= require("bcrypt");

const blog= require("./models/blog");

const havetoken= require("./middlewares/auth");
const { Console } = require("console");



const staticpath= path.join(__dirname,"/public/images")

app.use(express.static(staticpath));   

app.use(cookieparser());


app.use(express.json());
app.use(express.urlencoded({extended:false}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("./public/images/uploads"))
    },
    filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
cb(null,filename);
    
    }
  })
  const upload = multer({ storage: storage })



app.get("/add", havetoken("uid"), (req,res)=>{
    res.render("blogify",{
     
           user: validatetoken(req.cookies.uid),
         
   });
   

})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",async(req,res)=>{


const Passwords= req.body.Password;
const CPasswords= req.body.ConfirmPassword;

if (Passwords !== CPasswords) {
    // Passwords do not match
    return res.status(400).send("Passwords do not match");
}

const entry= new user({
    fullName:req.body.fullName,
    email:req.body.email,
    Password: req.body.Password,
    ConfirmPassword : req.body.ConfirmPassword
});


try{
await entry. save();
return res.redirect("/login");
}
catch(err){
    return res.status(401).json(err);
}

});



app.get("/login",async(req,res)=>{
    res.render("login");

})

app.post("/login",async(req,res)=>{
try{
const emai11= req.body.email;
const password= req.body.Password;
const result= await user.findOne({email:emai11});



if(result){
    const match = await bcrypt.compare(password,result.Password);

    if(match){
const token= createtoken(result);

// console.log(token);
        
        return res.cookie("uid",token).redirect("/");
    }
    else{
       return  res.status(400).send("Bad credentials");
        // return res.redirect("/login");
    }
}

else{
    return res.status(400).send("Bad Credentials")
}
}
catch(error){
    return res.render("login",{
        error:"Incorrect email or password"
    });
    console.log(err);   
}       

});

app.get("/logout",(req,res)=>{
    res.clearCookie("uid").redirect("/login");
})










app.get("/", havetoken("uid"), async(req,res)=>{
    
    const allblogs= await blog.find({})
    res.render("index",{
     
           user: validatetoken(req.cookies.uid),
         blogs:allblogs
   });
   

});

// app.use(express.static(staticpath));        

app.get("/blog/:idd", async (req, res) => {
    const findid = req.params.idd;

    try {
        const data = await blog.findOne({
            _id: findid,
        });

        res.render("body", {
            blogy: data,
        
        });

       
    } catch (err) {
        console.log(err);
    }
});

app.post("/submit",upload.single("image"),async(req,res)=>{
  
    const {title,body}=req.body;
    const bloging= await blog.create({
title,
body,
coverimageurl:`uploads/${req.file.filename}`                                                                                                                                                                                     
    })
 

   return  res.render("body",{
        blogy:bloging
    })



});




app.listen(port,()=>{
    console.log(`server is started at port ${port}`);
});
