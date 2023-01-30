const router = require("express").Router()
const User = require("../models/User.js")
const {verifyToken,verifyTokenAndAdmin} = require("../middlewares/verifyToken")
const jwt = require("jsonwebtoken")



//update user
router.put("/",verifyToken,async(req,res)=>{
    
    if (req.body._id == req.user.id || req.user.isAdmin) {
        
        try{
            let updatedUser = await User.findByIdAndUpdate(req.body._id,{
                $set: req.body
            },{new:true})
            updatedUser = updatedUser.toObject()
            delete updatedUser.password

            res.json({
                "success": true,
                "code":200,
                "message": "Successfully updated user",
                "response": updatedUser
               })

        }
        catch(err){
            console.log(err);
            res.json({
                "success": false,
                "code": 500,
                "message": JSON.stringify(err),
                "response": null
               });
        }
    }
    else{

    }
})

//get a user

router.get("/find",verifyToken,async(req,res)=>{
    let userId = req.query.userId

    const user = await User.findById(userId)

    const{password, ...other} = user._doc

    try{
        res.json({
            "success": true,
            "code":200,
            "message": "Successfully fetched user details",
            "response": other
           })
    }
    catch(err){
        console.log(err);
        res.json({
            "success": false,
            "code": 500,
            "message": JSON.stringify(err),
            "response": null
           });
    }
})
//follow a user
router.put("/follow",verifyToken,async(req,res)=>{
    if (req.body._id!= req.user.id) {
        try {
            const user = await User.findById(req.body._id)
            const currentUser = await User.findById(req.user.id)

            if(!user.followers.includes(req.user.id)){
                await user.updateOne({
                    $push: {followers: req.user.id}
                })

                await currentUser.updateOne({
                    $push: {following: req.body._id}
                })

                res.json({
                    "success": true,
                    "code": 200,
                    "message": "Successfully followed user",
                    "response": user
                   });
            }
            else{
                res.json({
                    "success": true,
                    "code": 200,
                    "message": "You already follow the user",
                    "response": null
                   });
            }

        } catch (error) {
            res.json({
                "success": false,
                "code": 500,
                "message": "Some unknown error occured",
                "response": null
               });
        }

       
    }
})

router.put("/unfollow",verifyToken,async(req,res)=>{
    if (req.body._id!= req.user.id) {
        try {
            const user = await User.findById(req.body._id)
            const currentUser = await User.findById(req.user.id)

            if(user.followers.includes(req.user.id)){
                await user.updateOne({
                    $pull: {followers: req.user.id}
                })

                await currentUser.updateOne({
                    $pull: {following: req.body._id}
                })

                res.json({
                    "success": true,
                    "code": 200,
                    "message": "Successfully unfollowed user",
                    "response": user
                   });
            }
            else{
                res.json({
                    "success": true,
                    "code": 200,
                    "message": "You already unfollow the user",
                    "response": null
                   });
            }

        } catch (error) {
            res.json({
                "success": false,
                "code": 500,
                "message": "Some unknown error occured",
                "response": null
               });
        }

       
    }
})




module.exports = router