import { prisma } from '../lib/prisma.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {body,matchedData,validationResult} from "express-validator";
const lengthErr= "length must be more than 1";
const emailErr= "Not a valid email";
const passwordErr="Minimum length: 8 characters Minimum of 1 lowercase character ,Minimum of 1 uppercase character,Minimum of 1 number,Minimum of 1 symbol "
const validateUser=[
    body("firstname").trim()
    .isLength({min:1}).withMessage(`first name err:${lengthErr}`),
    body("lastname").trim()
    .isLength({min:1}).withMessage(`last name err:${lengthErr}`),
    body("email").trim()
    .isEmail().withMessage(`ERROR:${emailErr}`),
    body("password").trim()
    .isStrongPassword().withMessage(`Password err ${passwordErr}`),
    body("confpassword").trim()
    .custom((value,{req})=>{
        return value ==req.body.password;
    }).withMessage("passwords don't match"),
   
]
async function getUsers(req,res){
    const users= await prisma.user.findMany();
    res.json({users:users,info:"Information"})
}
async function getUser(req,res){
    const{userId}=req.params;
    const user = await prisma.user.findUnique({
        where:{
            id:Number(userId)
        }
    })
    res.json({user:user})
}
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
    jwt.sign({userId:user.id,iat:Date.now()},process.env.SECRET_KEY,{expiresIn:"7d"},(err,token)=>{
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
    const bearer= bearerHeader.split(" ");
    const bearerToken =bearer[1];
    req.token=bearerToken;
    try{
        jwt.verify(bearerToken,process.env.SECRET_KEY);
        return next()
    }catch(error){
        return res.status(403).json({
            msg:"Invalid token"
        });
    }

}
const createUser = [validateUser,async function (req,res){
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.json(errors)
    }
    
    const {firstname,lastname,email,password}=matchedData(req);
    const hashedPassword = await bcrypt.hash(password,10);
    await prisma.user.create({
        data:{
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:hashedPassword
        }
    })
    res.json({msg:"user created"});


}]
export default{
    getUsers,
    getUser,
    createUser,
    verifyLogin,
    verifyToken
}