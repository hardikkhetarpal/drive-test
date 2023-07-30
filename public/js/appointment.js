$(document).ready(function(){
    if(sessionStorage.getItem("loggedin") !== "true" || sessionStorage.getItem('type') !== "admin"){
        sessionStorage.clear()
        window.location.href="/login"
        return
    }
    const hostname = `${window.location.protocol}//${window.location.host}`
    const dateField = document.getElementById('select-date')
    const view = document.getElementById('btn-view')
    const logout = document.getElementById('logout')
    const appointments = document.getElementById('appointments')
    // logout.addEventListener('click',(e)=>{
    //     e.preventDefault()
    //     sessionStorage.clear()
    //     window.location = '/?function=logout'
    // })
    view.addEventListener('click',function(){
        let date = dateField.value
        console.log(date)
        if(!date){
            $("#error-text").text("Date must be filled")
            return
        }
        $.ajax({
            type: "post",
            url: "/appointment/viewappointment",
            data: {"data" : JSON.stringify({"date" : date, "type" : sessionStorage.getItem("type"),"userid" : sessionStorage.getItem("userid")})},
            dataType: "json",
            success: function (response) {
                console.log(response)
                if(response.result == "success"){
                    let appointments_res = response.data
                    appointments.innerHTML = ""
                    for(let appointment of appointments_res){
                        let buttonDiv = document.createElement('div')
                        buttonDiv.className = "col-sm-6 col-md-4 col-lg-2"
                        let button = document.createElement('button')
                        button.className = "btn btn-dark mb-2"
                        button.type = "button"
                        button.id = appointment._id
                        button.innerText = `${appointment.start_time} - ${appointment.end_time}`
                        button.disabled = appointment.isAvailable || appointment.assignedTo != null
                        button.addEventListener('click',(e)=>{
                            e.preventDefault()
                            console.log(appointment._id)
                            $.ajax({
                                type: "post",
                                url: "/appointment/add",
                                data: 
                                    { "data" : JSON.stringify({
                                        id : appointment._id,
                                        date : appointment.date,
                                        userid : sessionStorage.getItem("userid"),
                                        type : sessionStorage.getItem("type")
                                    }
                                )},
                                dataType : "json",
                                success: function (response) {
                                    view.click()
                                    alert("Appointment was successfully made available")
                                }
                            });
                        })
                        buttonDiv.appendChild(button)
                        appointments.appendChild(buttonDiv)
                    }
                }
                else{
                    $("#error-text").text(response.reason)
                }
            }
        });
    })
})

// Full Stack Prog Group Project - GROUP 2