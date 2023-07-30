const mongoose = require('mongoose')
const Schema = mongoose.Schema

const carSchema = new Schema({
    make : {
        type : String,
        required : true,
    },
    year : {
        type : String,
        required : true,
    },
    model : {
        type : String,
        required : true,
    },
    plateNum : {
        type : String,
        required : true,
    },
    images : {
        type : [String]
    }
})

const carModel = mongoose.model('car',carSchema)
module.exports = carModel
