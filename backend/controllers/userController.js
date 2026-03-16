import { prisma } from '../lib/prisma.js';
async function getUsers(req,res){
    const users= await prisma.user.findMany();
    res.json({users:users,info:"Information"})
}
export default{
    getUsers
}