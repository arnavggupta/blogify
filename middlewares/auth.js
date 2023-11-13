const validatetoken=require("../services/stateless");
function havetoken(tokenname){

return (req,res,next)=>{



const tokens=req.cookies[tokenname];
if(!tokens){

return res.redirect("/login");

}

try {
    const validate= validatetoken(tokens);

    req.user= validate;
} catch (error) {
    
}
return next();



}

}

module.exports=havetoken;