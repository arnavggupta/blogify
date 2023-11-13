const mongoose= require("mongoose");

const blogschema= new mongoose.Schema({

title:{
    type:String,
    required:true
},
body:{
    type:String,
    required:true
},
coverimageurl:{
    type:String,

}

});


const blog= new mongoose.model("blog",blogschema);

module.exports= blog;