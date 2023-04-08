const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const profileSchema = new mongoose.Schema({
    username: String,
    fullName: String,
    name: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        required: false,
    },

    posts: [{caption:{type:String,required:false}, 
             image:String, 
             likes:[String],
             comments:[{username:String,content:String}],
           }],

    followers: [String],

    following: [String],

    feed: [{username:String,
            name:String,
            post_id: mongoose.Schema.Types.ObjectId,
            content:String,
            caption:{type:String,required:false},
            likes:[String],
            comments:[{username:String,content:String}],
        }],

    notifications:[String],
})

profileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Profile", profileSchema);