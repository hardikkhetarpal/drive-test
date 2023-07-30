const driverModel = require('../models/driver')
const carModel = require('../models/car')
const addressModel = require('../models/address')
const appointmentModel = require('../models/appointment')
const userController = require('./userController')
const moment = require('moment')

class appointmentController {
    static async createAppointments(params){
        try{
            let reqBody = JSON.parse(params)
            const user_id = reqBody.user_id
            const typeOfUser = reqBody.type
            let isValidUser = await userController.checkAccess({id : user_id, type : typeOfUser},["admin"])
            if(isValidUser){
                let appointments = createAppointmentArray(reqBody.date,reqBody.start_time,reqBody.end_time,parseInt(reqBody.no_of_appointments),parseInt(reqBody.length),user_id, reqBody.is_available)
                if(appointments.length < parseInt(reqBody.no_of_appointments)){
                    return {"result" : "error", "reason" : "Insufficient number of slots."}
                }
                else{
                    await appointmentModel.insertMany(appointments)
                    return {"result" : "success","message" : "Appointments have been successfully created"}
                }
            }
            else{
                return {"result" : "error","reason" : "Permission denied"}
            }
        }catch(err){
            return {"result" : "error","reason" : err.message}
        }
    }

    static async makeAppointmentAvailable(params){
        try{
            let jsonParams = JSON.parse(params)
            let access = userController.checkAccess({id : jsonParams.userid, type : jsonParams.type},['admin'])
            if(access){
                await appointmentModel.updateOne({_id : jsonParams.id},{isAvailable : true})
                let appointments = await appointmentModel.find({date : jsonParams.date})
                return {"result" : "success","data" : appointments}
            }
            else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            return {"result" : "error","reason" : "err.message"}
        } 
    }

    static async bookAppointment(params){
        try{
            let data = JSON.parse(params)
            let access = await userController.checkAccess({id : data.userid, type : data.type}, ["driver"])
            if(access){
                await appointmentModel.updateOne({_id : data.id},{isAvailable : false, assignedTo : data.userid, "type" : data.app_type})
                let appointments = await appointmentModel.find({date : req.query.date})
                return {"result" : "success","data" : appointments}
            }
            else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            return {"result" : "error","reason" : "err.message"}
        } 
    }


    static async viewAppointments(params){
        try{
            const data = JSON.parse(params)
            let isAllowed = await userController.checkAccess({"id" : data.userid, type : data.type},["admin","driver"])
            if(isAllowed){
                let appointments = await appointmentModel.find({date : data.date})
                if(appointments.length > 0){
                    return {"result" : "success","data" : appointments}
                }
                else{
                    return {"result" : "error","reason" : "No slots found"}
                }
            }
            else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            return {"result" : "error","reason" : err.message}
        }
    }


    static async viewAppointmentByUser(params){
        try{
            const data = JSON.parse(params)
            let isAllowed = await userController.checkAccess({"id" : data.userid, type : data.type},["driver"])
            if(isAllowed){
                let appointments = await appointmentModel.find({assignedTo : data.userid})
                if(appointments.length > 0){
                    return {"result" : "success","data" : appointments}
                }
                else{
                    return {"result" : "error","reason" : "No slots found"}
                }
            }
            else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            return {"result" : "error","reason" : err.message}
        }
    }

    static async viewTakenExams(params){
        try{
            let date = params.date
            let type = params.type
            let matchObj = {assignedTo : {$ne : null}}
            if(!isEmpty(date) && !isEmpty(type)){
                matchObj = {date : date, type : type, ...matchObj}
            }
            else if(!isEmpty(date) && isEmpty(type)){
                matchObj = {date : date, ...matchObj}
            }
            else if(isEmpty(date) && !isEmpty(type)){
                matchObj = {type : type, ...matchObj}
            }
            console.log(matchObj)
            let appointments = await appointmentModel.aggregate([
                {
                    $match : matchObj
                },
                {
                    $lookup : {
                        from: "drivers", // collection to join
                        localField: "assignedTo",//field from the input documents
                        foreignField: "userId",//field from the documents of the "from" collection
                        as: "driver"// output array field
                    }
                },
                {
                    $unwind: '$driver'
                },
            ])
            return {"result" : "success","data" : appointments}
        }catch(err){
            return {"result" : "error","reason" : err.message}
        }
    }

    static async viewGradedExams(params){
        try{
            let date = params.date
            let type = params.type
            let matchObj = {assignedTo : {$ne : null}, isGraded : true}
            if(!isEmpty(date) && !isEmpty(type)){
                matchObj = {date : date, type : type, ...matchObj}
            }
            else if(!isEmpty(date) && isEmpty(type)){
                matchObj = {date : date, ...matchObj}
            }
            else if(isEmpty(date) && !isEmpty(type)){
                matchObj = {type : type, ...matchObj}
            }
            console.log(matchObj)
            let appointments = await appointmentModel.aggregate([
                {
                    $match : matchObj
                },
                {
                    $lookup : {
                        from: "drivers", // collection to join
                        localField: "assignedTo",//field from the input documents
                        foreignField: "userId",//field from the documents of the "from" collection
                        as: "driver"// output array field
                    }
                },
                {
                    $unwind: '$driver'
                },
            ])
            return {"result" : "success","data" : appointments}
        }catch(err){
            return {"result" : "error","reason" : err.message}
        }
    }

    static async updateAppointmentStatus(params){
        try{
            let data = JSON.parse(params)
            console.log(data)
            let isValid = await userController.checkAccess({id : data.userid,type : data.type}, ["examiner"])
            console.log(data.comment,data)
            if(isValid){
                await appointmentModel.findByIdAndUpdate(data.app_id,{passFailStatus : data.status, comment : data.comments, isGraded : true})
                return {"result" : "success","message" : "Record updated successfully"}
            }else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            return {"result" : "error", "reason" : err.message}
        }
    }

    static async cancelAppointmentStatus(params){
        try{
            let data = JSON.parse(params)
            let isValid = await userController.checkAccess({"id" : params.user, "type" : params.type}, ["driver"])
            if(isValid){
                await appointmentModel.findByIdAndUpdate(data.app_id,{assignedTo : null, isAvailable : true})
                return {"result" : "success","message" : "Appointment has been succesfully cancelled."}
            }else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }
        catch(err){
            return {"result" : "error", "reason" : err.message}
        }
    }

    static async publishExamResult(params){
        try{
            let data = JSON.parse(params)
            let isAllowed = await userController.checkAccess({id : data.userid, type : data.type}, ["admin"])
            console.log(data.comment,data)
            if(isAllowed){
                await appointmentModel.findByIdAndUpdate(data.app_id,{isPublished : true})
                return {"result" : "success","message" : "Record has been published successfully"}
            }else{
                return {"result" : "error","reason" : "Permission Denied"}
            }
        }catch(err){
            return {"result" : "error", "reason" : err.message}
        }
    }
}

function createAppointmentArray(date, start_time, end_time, no_of_appts, len_of_appts,created_by,is_available){
    let appts = []
    let curr_time = new Date()
    //set hours and run iteratively
    curr_time.setHours(...start_time.split(":"))
    let newDateObj = moment(curr_time)
    let endTime = new Date()
    endTime.setHours(...end_time.split(":"))
    let dayEndTime = moment(endTime)
    let startingTime = newDateObj
    let endingTime = newDateObj.clone()
    while(no_of_appts){
        endingTime.add(len_of_appts,'m');
        if(endingTime.isBefore(dayEndTime)){
            appts.push({
                "date" : date,
                "start_time" : startingTime.format("hh:mm a"),
                "end_time" : endingTime.format("hh:mm a"),
                "createdBy" : created_by,
                "isAvailable" : is_available,
                "assignedTo" : null,
                "type" : "NA",
            })
            no_of_appts--;
            startingTime = endingTime.clone();
        }
        else{
            break
        }
    }
    return appts
}

function isEmpty(val){
    if(val === null || val === "" || val === undefined)
        return true
    return false
}

module.exports = appointmentController

