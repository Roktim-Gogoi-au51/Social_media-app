const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },

    password: {
        type: String,
        required: true,
    }

})

userSchema.plugin(passportLocalMongoose);

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      try {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
      } catch (error) {
        return next(error);
      }
    }
    next();
  });

module.exports = mongoose.model("User", userSchema);