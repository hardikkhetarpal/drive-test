const driverModel = require('../models/driver')
const carModel = require('../models/car')
const addressModel = require('../models/address')
const userController = require('./userController')
const mongoose = require('mongoose')

class driverController {
    static async readDriverDataByID(params){
        try{
            console.log(params)
            let isAllowed = await userController.checkAccess({id : params.userid, type : params.type},["admin","driver","examiner"])
            if(isAllowed){
                let searchDriver = params.driver_id
                console.log(searchDriver)
                let driver = await driverModel.aggregate([
                    {
                        $match : {"_id" : mongoose.Types.ObjectId(searchDriver) }
                    },
                    {
                        $project:{
                          addressId: 1,
                          carId : 1,
                          firstName : 1,
                          lastName : 1,
                          dateOfBirth : 1,
                          addressId: {"$toObjectId": "$addressId"},
                          carId: {"$toObjectId": "$carId"},
                        }
                    },
                    {
                        $lookup : {
                            from: "addresses", // collection to join
                            localField: "addressId",//field from the input documents
                            foreignField: "_id",//field from the documents of the "from" collection
                            as: "address"// output array field
                        }
                    },
                    {
                        $unwind: '$address'
                    },
                    {
                        $lookup : {
                            from: "cars", // collection to join
                            localField: "carId",//field from the input documents
                            foreignField: "_id",//field from the documents of the "from" collection
                            as: "car"// output array field
                        }
                    },
                    {
                        $unwind: '$car'
                    },
                ])
                if(driver){
                    return {"result" : "success","data" : driver}
                }
                else{
                    return {"result" : "error","reason" : "No data found"}
                }
            }else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            console.log(err)
            return {"result" : "error","reason" : err.message}
        }
    }

    static async getCarDetails(params){
        try{
            console.log(params)
            let isValid = await userController.checkAccess({"id" : params.userid, "type" : params.type},["admin","examiner"])
            if(isValid){
                let searchCar = params.search
                let car = await carModel.findById(searchCar)
                console.log(car)
                if(car){
                    return {"result" : "success","data" : car}
                }
                else{
                    return {"result" : "error","reason" : "No data found"}
                }
            }else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            return {"result" : "error","reason" : err.message}
        }
    }
    static async readDriverDataBySearch(params){
        try{
            let isAllowed = await userController.checkAccess({"id" : params.userid,"type" : params.type},["admin","driver","examiner"])
            if(isAllowed){
                let driver = await driverModel.aggregate([
                    {
                        $match : params.filter,
                    },
                    {
                        $project:{
                          addressId: 1,
                          carId : 1,
                          firstName : 1,
                          lastName : 1,
                          dateOfBirth : 1,
                          socialInsuranceNumber : 1,
                          addressId: {"$toObjectId": "$addressId"},
                          carId: {"$toObjectId": "$carId"},
                        }
                    },
                    {
                        $lookup : {
                            from: "addresses", // collection to join
                            localField: "addressId",//field from the input documents
                            foreignField: "_id",//field from the documents of the "from" collection
                            as: "address"// output array field
                        }
                    },
                    {
                        $unwind: '$address'
                    },
                    {
                        $lookup : {
                            from: "cars", // collection to join
                            localField: "carId",//field from the input documents
                            foreignField: "_id",//field from the documents of the "from" collection
                            as: "car"// output array field
                        }
                    },
                    {
                        $unwind: '$car'
                    },
                ])
                if(driver){
                    return {"result" : "success","data" : driver}
                }
                else{
                    return {"result" : "error","reason" : "No data found"}
                }
            }else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            return {"result" : "error" , "reason" : err.message}
        }
    }

    static async updateDriver(params){
        let reqBody = JSON.parse(params)
        console.log(reqBody)
        //get address_id and updated address details and car id and updated car details
        let {car_id,car,address_id,address} = reqBody
        console.log('------------')
        console.log(car,address)
        console.log('------------')
        console.log(car_id,address_id)
        console.log("-------------")
        await carModel.findByIdAndUpdate(car_id,car)
        await addressModel.findByIdAndUpdate(address_id,address)
        return {"result" : "success"}
    }

    static async createDriver(params){
        try{
            let reqBody = JSON.parse(params)
            let {personal,address,car} = reqBody
            //store car and get car id
            let carObject = await carModel.create(car)
            //store address and get address id
            let addressObject = await addressModel.create(address)
            personal.dateOfBirth = new Date(personal.dateOfBirth)
            personal.carId = carObject._id
            personal.addressId = addressObject._id
            //generate a random string from charecters
            personal.licenseNumber = makeid(9)
            // store personal data in collection
            let personalObject = await driverModel.create(personal)
            return {"result" : "success","license_number" : personalObject.licenseNumber}
        }catch(err){
            console.log(err)
            return {"result" : "error" , "reason" : err.message}
        }
    }

    static async storeImages(images,car_id){
        let resp = await carModel.findByIdAndUpdate(car_id,{images : images}).then(v =>{
            console.log(v)
        })
        return resp
    }

}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length ;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}


module.exports = driverController

// Full Stack Prog Group Project - GROUP 2