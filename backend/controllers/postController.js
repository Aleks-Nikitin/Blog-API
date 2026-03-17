import { prisma } from '../lib/prisma.js';
async function getUserPosts(req,res) {
    // author frontend app -> get all posts from 
    // yourself published and not on the dashboard
    const {id}=req.user
    const posts = await prisma.post.findMany({
        where:{
            userId:Number(id)
        }
    })
    res.json({posts:posts})
}
async function getPostsByAuthor(req,res){
    const{userId}=req.params;
    const posts = await prisma.post.findMany({
        where:{
            userId:Number(userId)
        }
    })
    res.json({posts:posts});
}
async function getPublishedPosts(req,res){
    //viewer frontend app -> get all published posts on the website
   const posts= await prisma.post.findMany({
        where:{
            published:true
        },
        include:{
            user:true,
            comments:true
        }
    })
    return res.json({published:posts})
}
async function updatePost(req,res) {
    const {id}=req.user
    const {postId}=req.params;
    const {msg,title}=req.body;
    const result =await prisma.post.update({
        where:{
            id:Number(postId),
            userId:Number(id)
        },
        data:{
            msg:msg,
            title:title
        }
    })
    if(result) res.json({msg:"post is updated", newPost:result})
    res.sendStatus(403);
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
async function createPost(req,res){
    console.log(req.user);
    const {id}=req.user
    const {msg,title,published}=req.body
    await prisma.post.create({
        data:{
            userId:Number(id),
            msg:msg,
            title:title,
            published:Boolean(published),
            timestamp:getFormattedDate()
        }
    })
    res.json({msg:"Post created"})
}
async function deletePost(req,res){
    const {id}=req.user
    const {postId}=req.params;
    await prisma.post.delete({
        where:{
            id:Number(postId),
            userId:Number(id),
        }
    })
    res.json({msg:"post is deleted"});
}
async function togglePublishedStatus(req,res){
    const {id}=req.user
    const {postId}= req.params;
    let toggle = true;
    const {published} = await prisma.post.findUnique({
        where:{
            id:Number(postId),
            userId:id
        }
    })
    if(published){
        toggle=false
    }
    await prisma.post.update({
        where:{
            userId:Number(id),
            id:Number(postId)
        },
        data:{
            published:toggle
        }
    })
    res.json({msg:"post status toggled"})
}
export default{
    getUserPosts,
    getPublishedPosts,
    togglePublishedStatus,
    updatePost,
    deletePost,
    createPost,
    getPostsByAuthor

}