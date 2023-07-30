$(document).ready(function () {
    if(sessionStorage.getItem("loggedin") !== "true" || sessionStorage.getItem('type') !== "admin"){
        sessionStorage.clear()
        window.location.href="/login"
        return
    }
    const pad = (i)=>{
        return i>9 ? i+"": "0"+i
    }
    const hostname = `${window.location.protocol}//${window.location.host}`
    const logout = document.getElementById('logout')
    const submitButton = document.getElementById('submit-app')
    const appointmentDate = document.getElementById('app-date')
    const numberOfAppointments = document.getElementById('no-of-apps')
    const startTime = document.getElementById('start-time')
    const endTime = document.getElementById('end-time')
    const appointmentLength = document.getElementById('app-len')
    //set min date today
    let d = new Date()
    let today = d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())
    appointmentDate.setAttribute('min',today)
    appointmentDate.value = today
    numberOfAppointments.value = 5
    startTime.value = "09:00"
    endTime.value = "17:00"
    appointmentLength.value = 30
    // logout.addEventListener('click',(e)=>{
    //     e.preventDefault()
    //     sessionStorage.clear()
    //     window.location = '/?function=logout'
    // })
    submitButton.addEventListener('click',(e)=>{
        e.preventDefault()
        console.log('submit')
        let appointmentDateValue = appointmentDate.value
        let numberOfAppointmentsValue = numberOfAppointments.value
        let startTimeValue = startTime.value
        let endTimeValue = endTime.value
        let appointmentLengthValue = parseInt(appointmentLength.value)
        if(isNaN(appointmentLengthValue)){
            alert("Please enter a valid appointment length")
            return
        }
        let appointmentObject = {
            "date" : appointmentDateValue,
            "start_time" : startTimeValue,
            "end_time" : endTimeValue,
            "no_of_appointments" : numberOfAppointmentsValue,
            "length" : appointmentLengthValue,
            "is_available" : false,
            "user_id" : sessionStorage.getItem('userid'),
            "type" : sessionStorage.getItem('type')
        }
        console.log(appointmentObject)

        $.ajax({
            type: "post",
            url: `${hostname}/appointment/createappointments`,
            data: {"data" : JSON.stringify(appointmentObject)},
            dataType: "json",
            success: function (response) {
                console.log(response)
                if(response.result === "success"){
                    alert("Appointments were successfully created.")
                }
                else{
                    alert("Appointments could not be created.")
                }
            }
        });
    })
});

// Full Stack Prog Group Project - GROUP 2