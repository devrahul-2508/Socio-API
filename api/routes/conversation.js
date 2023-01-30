const router = require("express").Router()
const Conversation = require("../models/Conversation")


// new conversatiion

router.post("/",async (req,res)=>{
    const newConversation = await new Conversation({
        members: [req.body.senderId,req.body.receiverId]
    })


    try {
        const savedConversation = await newConversation.save();

        res.json({
            "sucess": true,
            "code":200,
            "message": "Successfully added conversation",
            "response": savedConversation
        })
    } catch (error) {
        console.log(error);
        res.json({
            "sucess": false,
            "code":500,
            "message": JSON.stringify(err),
            "response": null
        })
    }
})


// get conversation of a user

router.get("/",async (req,res)=>{
    const userId = req.query.userId


    try{
        const conversation = await Conversation.find({
            members: { $in: [userId]}
        })

        res.json({
            "sucess": true,
            "code":200,
            "message": "Successfully fetched conversation",
            "response": conversation
        })
        
    }
    catch(err){
        res.json({
            "sucess": false,
            "code":500,
            "message": err,
            "response": null
        })
    }
})

module.exports = router