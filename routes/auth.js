const router = require('express').Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")




//REGISTER
router.post("/register",async(req,res)=>{
    
    try{
        const user =  new User({
            username: req.body.username,
            email:req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC)
        })
    
        let newUser = await user.save()

        newUser = newUser.toObject()
        
        const accessToken = jwt.sign({
            id: newUser._id,
            isAdmin: newUser.isAdmin
          },process.env.JWT_SEC)

          newUser.accessToken = accessToken
          delete newUser.password
    
        res.json({
            "sucess": true,
            "code":200,
            "message": "Successfully added user",
            "response": newUser
        })
    }
    catch(e){
        console.log(e);
        res.json({
            "sucess": false,
            "code":500,
            "message": JSON.stringify(err),
            "response": null
        })
    }
   
})


router.post("/login",async (req,res)=>{

    try{

        let user = await User.findOne({email: req.body.email})

        if(!user){
            res.json({
                "success": false,
                "code": 501,
                "message": "Wrong Credentials",
                "response": null
               });
        }
        else{
            const hashedPassword = CryptoJS.AES.decrypt(user.password,process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);
            console.log(hashedPassword);

            if(hashedPassword === req.body.password){
                const accessToken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                  },process.env.JWT_SEC,
                 
                  );
        
            
              user = user.toObject();
              user.accessToken = accessToken;
              delete user.password;
              console.log(user);
                res.json({
                 "success": true,
                 "code":201,
                 "message": "Successfully signed in",
                 "response": user
                })
            }
            else{
                res.json({
                    "success": false,
                    "code": 501,
                    "message": "Wrong Password",
                    "response": null
                   });
            }
        }
    }
    catch(err){
        console.log(err);
    }
})

module.exports = router