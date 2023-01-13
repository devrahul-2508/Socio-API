const router = require("express").Router()



router.get("/",(req,res)=>{
    res.send("Welcome to user page")
})


module.exports = router