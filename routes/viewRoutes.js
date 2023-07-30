const express = require('express')
const router = express.Router()

// router for views
router.get("/",(req,res)=>{
    let status = req.query.func
    let type = req.query.type
    console.log(status,type)
    if(status === "logout"){
        console.log('logout')
        res.render('Dashboard',{
            func : status,
            type : "new"
        })
    }else if(type){
        console.log('logged in')
        res.render('Dashboard',{
                func : null,
                type : type
        })
    }
    else{
        console.log('new')
        res.render('Dashboard',{
            func : null,
            type : "new"
    })
    }
})

router.get("/login",(req,res)=>{
    res.render("Login",{
        "type" : "login",
    })
})

router.get("/register",(req,res)=>{
    res.render("Login",{
        "type" : "register",
    })
})


router.get("/gtest",(req,res)=>{
    res.render("GTest_Page",{
        type : "G"
    })
})

router.get("/g2test",(req,res)=>{
    res.render("G2Test_Page", {
        type : "G2"
    })
})

router.get('/view',(req,res)=>{
    res.render("View")
})

router.get('/addappointment',(req,res)=>{
    res.render('Appointment')
})

router.get('/createappointment',(req,res)=>{
    res.render("Admin")
})

router.get('/updateresult',(req,res)=>{
    res.render('Examiner')
})

router.get('/publishresults',(req,res)=>{
    res.render('Results')
})

module.exports = router

