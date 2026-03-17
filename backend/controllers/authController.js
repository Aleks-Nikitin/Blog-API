import { prisma } from '../lib/prisma.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
async function verifyLogin(req,res,next){
    const {email}=req.body;
    const user = await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!user){
        return res.json({msg:"Incorrect email"})
    }
    const match =await bcrypt.compare(req.body.password,user.password);
    if(!match){
        return res.json({msg:"Incorrect password"})
    }
    jwt.sign({id:user.id},process.env.SECRET_KEY,{expiresIn:"3d"},(err,token)=>{
        if(err){
            throw new Error
        }
       return res.json({token:token});
    })

}
async function verifyToken(req,res,next){
    const bearerHeader=req.headers["authorization"];
    if(typeof bearerHeader=="undefined" ){
       return res.status(401).json({
            msg:"access token required"
        })
    }
  
    try{
        const bearer= bearerHeader.split(" ");
        const bearerToken =bearer[1];
        const decoded =jwt.verify(bearerToken,process.env.SECRET_KEY);
        req.user=decoded;
        console.log(decoded);
        next()
    }catch(error){
        return res.status(403).json({
            msg:"Invalid token"
        });
    }

}
export default {
    verifyLogin,
    verifyToken
}