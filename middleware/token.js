const jwt =require('jsonwebtoken');
const { StatusCodes } = require("http-status-codes");

require("dotenv").config();

function authenticateToken(req,res,next){
    
    const authHeader=req.headers['token'];
    const token=authHeader


 if(token==null) return res.sendStatus(StatusCodes.NOT_ACCEPTABLE);

    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        console.log(err)
        if (err) return res.sendStatus(StatusCodes.UNAUTHORIZED)

     req.user=user
       
      next()
    });
}

module.exports=authenticateToken