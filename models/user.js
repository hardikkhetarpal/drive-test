const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    type : {
        type : String,
        required : true,
    },
})
userSchema.pre('save',async function(next){
    let user = this
    console.log(user.password)
    let salt = bcrypt.genSaltSync(10)
    let passwordHashed = await bcrypt.hash(user.password,salt)
    user.password = passwordHashed
    next()
})
const userModel = mongoose.model('user',userSchema)
module.exports = userModel
