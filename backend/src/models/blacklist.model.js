const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required for blacklisting."],
        unique:[true,"Token is already blacklisted."]
    }
},{
    timestamps:true
})

const blacklistModel = mongoose.model("blacklists",blacklistSchema)

module.exports = blacklistModel;