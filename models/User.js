const mongoose = require('mongoose')
const {Schema} = mongoose
const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilePicture:{
        type: String,
        default:""
    },
    coverPicture:{
        type: String,
        default:""
    },
    followers:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isAdmin:{
        type: Boolean,
        default: false
    }
    },
    { timestamps: true}
    )


module.exports = mongoose.model("User",UserSchema)