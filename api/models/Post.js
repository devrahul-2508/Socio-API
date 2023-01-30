const mongoose = require('mongoose')
const { Schema } = mongoose

const PostSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    desc:{
        type: String
    },
    img:{
        type: String
    },
    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
},{timestamps: true})

module.exports = mongoose.model("Post",PostSchema)