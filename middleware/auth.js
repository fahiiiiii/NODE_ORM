const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req,res,next)=>{
    const authHeaders = req.headers.authorization;
    const token = authHeaders && authHeaders.split(" ")[1]
    if(!token){
        return res.status(401).json("Unauthorized")
    }else{
        jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
            if(err){
                res.json("Unauthorized")
            }else{
                req.fruit = payload;
                next();
            }
        })
    }
}