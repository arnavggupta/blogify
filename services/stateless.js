const jwt= require("jsonwebtoken");
const secret= "@arnavop1234"


function createtoken(user){

const payload={
    fullName:user.fullName,
    _id: user.id,
    email:user.email,
    Profileimage:user.Profileimage,
    role:user.role
};


const token =jwt.sign(payload,secret);
return token;

}


function validatetoken(token) {
    try {
        const match = jwt.verify(token, secret);
        return match;
    } catch (error) {
        // Handle token validation error (e.g., expired token, invalid token)
        console.error("Token validation error:", error);
        return null; // Or throw an error, depending on your application's needs
    }
}


module.exports={
    createtoken,
    validatetoken
};