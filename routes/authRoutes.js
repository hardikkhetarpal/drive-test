const express = require('express')
const userController = require('../controller/userController')

const router = express.Router()

router.post('/login',async (req,res)=>{
    try{
        let params = req.body.data
        let response = await userController.checkUser(params)
        res.send(response)
    }catch(err){
        console.log(err)
        res.send({"result" : "error", "reason" : err.message})
    }
})

router.post('/register',async (req,res)=>{
    try{
        let params = req.body.data
        let response = await userController.createUser(params)
        res.send(response)
    }catch(err){
        console.log(err)
        res.send({"result" : "error","reason" : err.message})
    }

})

router.post('/logout',(req,res)=>{
    res.redirect('/')
})
module.exports = router
