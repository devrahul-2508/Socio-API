const router = require('express').Router()
const {verifyToken} = require("../middlewares/verifyToken")
const Post = require("../models/Post")
const User = require('../models/User')
const { route } = require('./user')


//create a post
router.post("/",verifyToken,async(req,res)=>{
    const {desc,img} = req.body
    const userId = req.user.id
    const newPost = new Post({
        userId: userId,
        desc: desc,
        img:img
    })
    try {
        const savedPost = await newPost.save()
        res.json({
            "success": true,
            "code":200,
            "message": "Successfully uploaded your post",
            "response": savedPost
           })
    } catch (error) {
        console.log(error);
        res.json({
            "success": false,
            "code": 500,
            "message": JSON.stringify(err),
            "response": null
           });
    }
})

//update a post
router.put("/",verifyToken,async(req,res)=>{

    if(req.body.userId == req.user.id){
        try {
            updatedPost = await Post.findByIdAndUpdate(req.body._id,{
                $set: req.body
            },{new:true})

            
    
            res.json({
                "success": true,
                "code":200,
                "message": "Successfully updated post",
                "response": updatedPost
               })
            
        } catch (error) {
            res.json({
                "success": false,
                "code":500,
                "message": JSON(error),
                "response": null
               })
        }
    }
    else{
        res.json({
            "success": false,
            "code":500,
            "message": "You cannot edit other's post",
            "response": null
           })
    }
    

    
})


//delete a post

router.delete("/",verifyToken,async(req,res)=>{
    
    if(req.body._id==req.user.id){
        try {
            deletedPost = await Post.findByIdAndDelete(req.body._id) 
    
            res.json({
                "success": true,
                "code":200,
                "message": "Successfully deleted post",
                "response": deletedPost
               })
            
        } catch (error) {
            res.json({
                "success": false,
                "code":500,
                "message": JSON(error),
                "response": null
               })
        }
    }
    else{
        res.json({
            "success": false,
            "code":500,
            "message": "You cannot delete other's post",
            "response": null
           })
    }

    
})


router.get("/",verifyToken,async(req,res)=>{
    try{
        postId = req.query.postId
        const post = await Post.findById(postId).populate("userId")

        if(post){
            res.json({
                "success": true,
                "code":200,
                "message": "Successfully fetched post",
                "response": post
               })
        }
        else{
            res.json({
                "success": false,
                "code":500,
                "message": "Cannot find post",
                "response": null
               })
        }
       
    }
    catch(err){
        console.log(err);
        res.json({
            "success": false,
            "code":500,
            "message": "Cannot find post",
            "response": null
           })
    }
})


//like or dislike a post
router.put("/like",verifyToken,async(req,res)=>{
    try {
        const post = await Post.findById(req.body._id)
        if(!post.likedBy.includes(req.user.id)){
            await post.updateOne({
                $push:{
                    likedBy: req.user.id
                }
            })
            res.json({
                "success": true,
                "code":200,
                "message": "Successfully liked post",
                "response": null
               })
        }
        else{
            await post.updateOne({
                $pull:{
                    likedBy: req.user.id
                }
            })
            res.json({
                "success": true,
                "code":200,
                "message": "Successfully unliked post",
                "response": null
               })
        }
    } catch (error) {
        res.json({
            "success": false,
            "code":500,
            "message": "error occured while liking",
            "response": null
           })
    }
})


// get timeline posts

router.get("/timeline",verifyToken,async(req,res)=>{
    let postArray = []
    try{
        const currentUser = await User.findById(req.user.id)
        console.log("Hello");
        console.log(currentUser);
        const userPosts = await Post.find({userId: currentUser._id})
        console.log(userPosts);
        const friendPosts = await Promise.all(
         currentUser.following.map((friendId)=>{
            return Post.find({ userId: friendId })

         }
        ))

        console.log(friendPosts);


        res.json({
            "success": true,
            "code":200,
            "message": "Successfully fetched timeline",
            "response": (userPosts.concat(...friendPosts))
           })

    }
    catch(err){
        console.log(err);
        res.json({
            "success": false,
            "code":500,
            "message": "Error",
            "response": null
           })
    }
})


module.exports = router