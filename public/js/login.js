$(document).ready(function(){
    if(sessionStorage.getItem("loggedin") === "true"){
        if(sessionStorage.getItem("type") == "admin"){
            location.href="/createappointment"
        }
        else if(sessionStorage.getItem("type") == "driver"){
            location.href="/g2test"
        }
        else if(sessionStorage.getItem("type") === "examiner"){
            location.href = "/updateresult"
        }
    }
    const hostname = `${window.location.protocol}//${window.location.host}`
    const loginUname = document.getElementById('log-uname')
    const loginPassword = document.getElementById('log-password')
    const loginButton = document.getElementById('login')
    const loginUserType = document.getElementById('log-utype')

    const regUname = document.getElementById('reg-uname')
    const regPassword = document.getElementById('reg-password')
    const regUserType = document.getElementById('reg-utype')
    const regVerifyPassword = document.getElementById('reg-verify-password')
    const regButton = document.getElementById('register')
    if(loginButton){
        loginButton.addEventListener('click',(e)=>{
            let loginUsernameValue = loginUname.value
            let loginPasswordValue = loginPassword.value
            if(loginUsernameValue == ""){
                $("#error-text").text("Username cannot be empty")
                return
            }
            if(loginPasswordValue == ""){
                $("#error-text").text("Password cannot be empty")
                return
            }
            $("#error-text").text("")
            $.ajax({
                type: "post",
                url: "/auth/login",
                data: {"data" : JSON.stringify({"username" : loginUsernameValue, "password" : loginPasswordValue,"type" : loginUserType.options[loginUserType.selectedIndex].value})},
                dataType: "json",
                success: function (response) {
                    if(response.result === "success"){
                        sessionStorage.setItem("loggedin","true")
                        sessionStorage.setItem("userid",response.user)
                        sessionStorage.setItem("type",loginUserType.options[loginUserType.selectedIndex].value)
                        alert("Successfully logged in!!")
                        if(sessionStorage.getItem("type") == "driver"){
                            window.location.href = `${hostname}/g2test`
                        }
                        else if(sessionStorage.getItem("type") == "admin"){
                            window.location.href = `${hostname}/createappointment`
                        }
                        else if(sessionStorage.getItem("type") == "examiner"){
                            window.location.href = `${hostname}/updateresult`
                        }
                    }
                    else{
                        $("#error-text").text(response.reason)
                        window.location.href="/register"
                    }
                }
            });
        }) 
    }


    if(regButton){
        console.log('help')
        regButton.addEventListener('click',(e)=>{
            let regUsernameValue = regUname.value
            let regPasswordValue = regPassword.value
            let regVerifyPasswordValue = regVerifyPassword.value
            if(regUsernameValue == ""){
                $("#error-text").text("Username cannot be empty")
                return
            }
            if(regPasswordValue == ""){
                $("#error-text").text("Password cannot be empty")
                return
            }
            if(regVerifyPasswordValue == ""){
                $("#error-text").text("Verify-Password cannot be empty")
                return
            }
            if(regVerifyPasswordValue !== regPasswordValue){
                $("#error-text").text("Password and verification password must match.")
                return
            }
            $("#error-text").text("")
            $.ajax({
                type: "post",
                url: "/auth/register",
                data: {"data" : JSON.stringify({"username" : regUsernameValue, "password" : regPasswordValue, "type" : regUserType.options[regUserType.selectedIndex].value})},
                dataType: "json",
                success: function (response) {
                    if(response.result == "success"){
                        window.location.href="/login"
                        alert("You have been registered successfully, Please login to begin.")
                    }else{
                        $("#error-text").text(response.reason)
                        window.location = "/register"
                    }
                }
            });
        }) 
    }
})

// Full Stack Prog Group Project - GROUP 2