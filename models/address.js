const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
    street : {
        type : String,
        required : true,
    },
    city : {
        type : String,
        required : true,
    },
    province : {
        type : String,
        required : true,
    },
    postalCode : {
        type : String,
        required : true,
    }
})

const addressModel = mongoose.model('address',addressSchema)
module.exports = addressModel

