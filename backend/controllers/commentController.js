import {prisma }from "../lib/prisma.js"
async function createComment(req,res){
    const {id}=req.user;
    const {msg}= req.body;
    const {postId}=req.params
    const com = await prisma.comment.create({
        data:{
            userId:Number(id),
            msg:msg,
            timestamp:getFormattedDate(),
            postId:Number(postId)
        }
    })
    res.json({msg:com});
}
function getFormattedDate(){
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    let hh = today.getHours();
    let min = today.getMinutes();
     if (hh< 10) hh = '0' + hh;
    if (min< 10) min = '0' + min;
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = `${hh}:${min}  ${mm}/${dd}/${yyyy}`;
    return formattedToday;
}
async function getCommentsByPost(req,res){
    const {postId}=req.params;
    const comments = await prisma.comment.findMany({
        where:{
            postId:Number(postId)
        }
    })
    res.json({comments:comments});
}
async function getCommentsByUser(req,res) {
    const {userId}=req.params;
    const comments=await prisma.comment.findMany({
        where:{
            userId:Number(userId)
        }
    })
    res.json({comments:comments})
}
async function deleteComment(req,res) {
    const {commentId}=req.params;
    const com =await prisma.comment.delete({
        where:{
            id:Number(commentId)
        }
    })
    res.json({msg:com})
}
async function updateComment(req,res) {
    const {commentId}=req.params
    const {msg}=req.body;
    const com = await prisma.comment.update({
        where:{
            id:Number(commentId),
        },
        data:{
            msg:msg,
            timestamp:getFormattedDate()
        }
    })
    res.json({msg:com})
}
export default {
    createComment,
    getCommentsByPost,
    getCommentsByUser,
    deleteComment,
    updateComment
}