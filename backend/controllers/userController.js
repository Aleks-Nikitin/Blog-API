import { prisma } from '../lib/prisma.js';
import bcrypt from "bcryptjs"
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

/*async function updateUser(req,res) {
    const {user}=req.user
    await prisma.user.update({
        where:{
            id:user.id
        }
        data:{

        }
    })
}*/
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
}