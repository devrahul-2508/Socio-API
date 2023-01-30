const router = require("express").Router()
const Message = require("../models/Message")


//add

router.post("/",async(req,res)=>{
    const newMessage = new Message(req.body)


    try {
        const savedMessage = await newMessage.save()

        res.json({
            "sucess": true,
            "code":200,
            "message": "Successfully saved message",
            "response": savedMessage
        })

    } catch (error) {
        res.json({
            "sucess": false,
            "code":500,
            "message": err,
            "response": null
        })
    }
})



//get all messages in conversation

router.get("/", async(req,res)=>{
    try {
        const conversation = req.query.conversationId


        const messages = await Message.find({
            conversationId: conversation
        })

        res.json({
            "sucess": true,
            "code":200,
            "message": "Successfully fetched messages",
            "response": messages
        })


    } catch (error) {
        res.json({
            "sucess": false,
            "code":500,
            "message": err,
            "response": null
        })
    }
})


module.exports = router