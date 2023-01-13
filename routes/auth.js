const router = require('express').Router()
const User = require("../models/User")




//REGISTER
router.post("/register",async(req,res)=>{
    const user =  new User({
        username: req.body.username,
        email:req.body.email,
        password:req.body.password
    })

    const newUser = await user.save()

    res.json({
        "sucess": true,
        "code":200,
        "message": "Successfully added user",
        "response": newUser
    })
})

module.exports = router