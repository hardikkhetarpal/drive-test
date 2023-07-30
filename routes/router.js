const express = require('express')
const formidable = require('formidable')
const driverController = require('../controller/driverController')
const appointmentController = require('../controller/appointmentController')
const router = express.Router()

//modularize code to separate routes
router.post('/read',async (req,res)=>{
    try{
        let paramsForController = JSON.parse(req.body.data)
        let response = await driverController.readDriverDataBySearch(paramsForController)
        res.send(response)
    }catch(err){
        console.log(err)
        res.send({"result" : "error" , "reason" : err.message})
    }
})

router.post('/update', async (req,res)=>{
    try{
        let response = await driverController.updateDriver(req.body.data)
        res.send(response)
    }catch(err){
        console.log(err)
        res.send({"result" : "error" , "reason" : err.message})
    }
})

router.post('/setimages',async (req,res)=>{
    try{
        // use formidable to parse multipart form data
        let form = new formidable.IncomingForm({
            multiples : true,
            maxFileSize : 50 * 1024 * 1024,
            // uploadDir : "C:\\tmp",
            uploadDir : "/Users/myke/Pictures/FS_GP",
            keepExtensions : true
        })
        await form.parse(req,async (err,fields,files)=>{
            if(err){
                res.send({"result" : "errror","reason" : err.message})
                return
            }
            // store image urls in the car collection
            let images = [...Object.values(files).map(v => v.filepath)]
            let resp = await driverController.storeImages(images,fields.car_id)
            if(resp){
                console.log(resp)
            }
        })
        res.send({"result" : "success"})
    }catch(err){
        console.log(err)
        res.send({"result" : "errror","reason" : err.message})
    }
})
router.post('/create',async (req,res)=>{
    try{
        let response = await driverController.createDriver(req.body.data)
        res.send(response)
    }catch(err){
        console.log(err)
        res.send({"result" : "error" , "reason" : err.message})
    }
})


router.post("/createappointments",async (req,res)=>{
    try{
        let response = await appointmentController.createAppointments(req.body.data)
        res.send(response)
    }catch(err){
        res.send({"result" : "error","reason" : err.message})
    }
})

router.post('/add',async (req,res)=>{
    try{
        let response = await appointmentController.makeAppointmentAvailable(req.body.data)
        res.send(response)
    }catch(err){
        res.send({"result" : "error","reason" : "err.message"})
    } 
})

router.post('/book',async (req,res)=>{
    try{
        let response = await appointmentController.bookAppointment(req.body.data)
        res.send(response)
    }catch(err){
        res.send({"result" : "error","reason" : "err.message"})
    } 
})


router.post('/viewappointment',async (req,res)=>{
    try{
        let response = await appointmentController.viewAppointments(req.body.data)
        res.send(response)
    }catch(err){
        res.send({"result" : "error","reason" : err.message})
    }
})

router.post('/viewbyuser',async (req,res)=>{
    try{
        let response = await appointmentController.viewAppointmentByUser(req.body.data)
        res.send(response)
    }catch(err){
        res.send({"result" : "error","reason" : err.message})
    }
})

router.get('/viewexams',async (req,res)=>{
    try{
        let response = await appointmentController.viewTakenExams(req.query)
        res.send(response)
    }catch(err){
        res.send({"result" : "error","reason" : err.message})
    }
})

router.get('/viewgrades',async (req,res)=>{
    try{
        let response = await appointmentController.viewGradedExams(req.query)
        res.send(response)
    }catch(err){
        res.send({"result" : "error","reason" : err.message})
    }
})

router.get('/getuser',async (req,res)=>{
    try{
        let response = await driverController.readDriverDataByID(req.query)
        res.send(response)
    }catch(err){
        console.log(err)
        res.send({"result" : "error","reason" : err.message})
    }
})

router.get('/getcar',async (req,res)=>{
    try{
        let response = await driverController.getCarDetails(req.query)
        res.send(response)
    }catch(err){
        res.send({"result" : "error","reason" : err.message})
    }
})

router.post('/updatestatus',async (req,res)=>{
    try{
        let response = await appointmentController.updateAppointmentStatus(req.body.data)
        res.send(response)
    }catch(err){
        res.send({"result" : "error", "reason" : err.message})
    }
})
router.post('/cancel',async (req,res)=>{
    try{
        let response = await appointmentController.cancelAppointmentStatus(req.body.data)
        res.send(response)
    }
    catch(err){
        res.send({"result" : "error", "reason" : err.message})
    }
})
router.post('/publishresult',async (req,res)=>{
    try{
        let response = await appointmentController.publishExamResult(req.body.data)
        res.send(response)
    }catch(err){
        res.send({"result" : "error", "reason" : err.message})
    }
})

module.exports = router

