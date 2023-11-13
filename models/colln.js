const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const userschema= new mongoose.Schema({

fullName:{
type:String,
required:true
},
email:{

    type:String,
    required:true,
    unique:true
},


Password:{
    type:String,
    required:true
},  
ConfirmPassword:{
    type:String,
    required:true
},
Profileimage:{
    type:String,
default: "/images/download.png",

},
role:{
type:String,
//  ENUM MATLAB USER ADMIN MAI SE CHOIE KI BOSS APNE PASS
enum:["USER","ADMIN"],
default:"USER",
}



});



userschema.pre("save",async function (next){

if(this.isModified("Password")){
    const a= this.Password;
const b= this.ConfirmPassword;

this.Password= await bcrypt.hash(a,10);
this.ConfirmPassword=await bcrypt.hash(b,10);
}

next();
});

const user= new mongoose.model("user",userschema);
module.exports=user;
