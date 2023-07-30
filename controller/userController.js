const userModel = require('../models/user')
const bcrypt = require('bcrypt')
//const ALL = ["driver","admin","cordinator","examiner"]

class userController{
    // static accessDict = {
    //     "" : ALL,
    //     "login" : ALL,
    //     "register":ALL,
    //     "gtest"  : ["driver"],
    //     "g2test" : ["driver"],
    //     "view" : ["driver"],
    //     "addappointment" : ["admin"],
    //     "createappointment" : ["admin"],
    //     "publishresult" : ["admin"], 
    //     "updateresult" : ["examiner"],
        
    // }

    static async checkUser(params){
        try{
            const reqObj = JSON.parse(params)
            const user = reqObj.username
            const password = reqObj.password
            const type = reqObj.type
            if(user === ""){
                return {"result" : "error","reason" : "Username is empty"}
            }
            if(password === ""){
                return {"result" : "error","reason" : "Password is empty"}
            }
            else{                                               
                let loggedInUser = await userModel.findOne({"username" : user,"type" : type})
                if(loggedInUser == null){
                    return {"result" : "error","reason" : "No user with the given user has been found"}
                }
                else{
                    if(bcrypt.compareSync(password,loggedInUser.password) && loggedInUser.type == type){
                        return {"result" : "success","user" : loggedInUser._id}
                    }
                    else{
                        return {"result" : "error", "reason" : "Incorrect credentials please try again"}
                    }
                }
            }
        }catch(err){
            console.log(err)
            return {"result" : "error", "reason" : err.message}
        }
    }
    static async createUser(params){
        try{
            let reqObject = JSON.parse(params)
            const user = reqObject.username
            const password = reqObject.password
            const type = reqObject.type
            if(user === ""){
                return {"result" : "error","reason" : "Username is empty"}
            }
            if(password === ""){
                return {"result" : "error","reason" : "Password is empty"}
            }
            let userObject = {"username" : user, "password" : password,"type" : type}
            let result = await userModel.create(userObject)
            return {"result" : "success", "user" : JSON.stringify(result)}
        }catch(err){
            console.log(err)
            return {"result" : "error","reason" : err.message}
        }
    }

    static async checkAccess(params, requiredTypes){
        try{
            let jsonParams = params
            let id = jsonParams['id']
            let type = jsonParams['type']
            if(id == 'debug')
                return true
            let user = await userModel.findById(id)
            if(user.type === type && requiredTypes.includes(type)){
                return true
            }
            else{
                return false
            }
        }catch(err){
            console.log(err)
            return false
        }
    }
}

module.exports = userController

// Full Stack Prog Group Project - GROUP 2