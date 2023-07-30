const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const driverSchema = new Schema({
    userId : {
        type : String,
        required : true,
        unique : true,
    },
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : true,
    },
    dateOfBirth : {
        type : String,
        required : true,
    },
    socialInsuranceNumber : {
        type : String,
        required : true,
        unique : true,
    },
    addressId : {
        type : String,
        required : true
    },
    carId : {
        type : String,
        required : true
    },
    licenseNumber : {
        type : String,
        required : true,
        unique : true,
    }
})
driverSchema.pre('save',async function(next){
    let driver = this
    let licenseNumber = await bcrypt.hash(driver.licenseNumber,bcrypt.genSaltSync(10))
    let sin = await bcrypt.hash(driver.socialInsuranceNumber,bcrypt.genSaltSync(10))
    driver.licenseNumber = licenseNumber
    driver.sin = sin
    next()
})
const driverModel = mongoose.model('driver',driverSchema)
module.exports = driverModel
