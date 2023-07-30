const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
    date : {
        type : String,
        required : true,
    },
    start_time : {
        type : String,
        required : true,
    },
    end_time : {
        type : String,
        required : true,
    },
    createdBy : {
        type : String,
        required : true,
    },
    isAvailable : {
        type : Boolean,
        required : false,
    },
    assignedTo : {
        type : String,
        required : false,
        sparse:true,
    },
    type : {
        type : String,
        required : true,
    },
    comment : {
        type : String,
        required : false,
        default : "",
    },
    passFailStatus : {
        type : Boolean,
        required : true,
        default : false,
    },
    isGraded : {
        type : Boolean,
        required : true,
        default : false,
    },
    isPublished : {
        type : Boolean,
        required : true,
        default : false,
    }
})

const appointmentModel = mongoose.model('appointments',appointmentSchema)
module.exports = appointmentModel
