const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = require('./routes/router')
const authRouter = require('./routes/authRoutes')
const viewRouter = require('./routes/viewRoutes')

const app = express()
//setup mongodb
mongoose.connect('mongodb+srv://hardikkhetarpal2:9255287773@cluster0.abf7jdc.mongodb.net/',(err,res)=>{
    if(err){
        console.log("Error connecting with database")
    }
    else{
        console.log("Database connected successfully")
    }
})
//set view engine
app.set('view engine','ejs')
//set views folder
app.set('views',path.join(__dirname,'/views'))
//set static folder to serve static assets like css and js files
app.use(express.static(path.join(__dirname,'/public')))
//use body parser to read url body
app.use(bodyParser.urlencoded({extended : false, limit : '50mb'}))
// use authRouter for authentication
app.use('/auth',authRouter)
//use router module to submit request
app.use('/appointment',router)
// public routes
app.use('/',viewRouter)


//start app to listen on port
app.listen(3000 , (req,res)=>{
    console.log('Server is running at port 3000')
})

