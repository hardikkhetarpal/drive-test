$(document).ready(function () {
    if(sessionStorage.getItem("loggedin") !== "true" || sessionStorage.getItem('type') != "driver"){
        sessionStorage.clear()
        window.location.href="/login"
        return
    }
    const hostname = `${window.location.protocol}//${window.location.host}`
    const logout = document.getElementById('logout')
    const firstName = document.getElementById('fname')
    const lastName = document.getElementById('lname')
    const socialInsuranceNumber = document.getElementById('sin')
    const dateOfBirth = document.getElementById('dob')
    const street = document.getElementById('street')
    const city = document.getElementById('city')
    const province = document.getElementById('prov')
    const postalCode = document.getElementById('post')
    const make = document.getElementById('make')
    const model = document.getElementById('model')
    const year = document.getElementById('year')
    const plate = document.getElementById('plate')
    const submitG2 = document.getElementById('submitg2')
    const dateField = document.getElementById('select-date')
    const view = document.getElementById('btn-view')
    const appointments = document.getElementById('appointments')
    // logout.addEventListener('click',(e)=>{
    //     e.preventDefault()
    //     sessionStorage.clear()
    //     window.location = '/?function=logout'
    // })
    submitG2.addEventListener('click',(e)=>{
        // regex for validations
        let sinRegExp = /^(\d{3}-\d{3}-\d{3})|(\d{9})$/
        let postalRegExp = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i
        let firstNameValue = firstName.value
        let lastNameValue = lastName.value
        let socialInsuranceNumberValue = socialInsuranceNumber.value
        let dateOfBirthValue = dateOfBirth.value

        let streetValue = street.value
        let cityValue = city.value
        let provinceValue = province.value
        let postalCodeValue = postalCode.value
        
        let makeValue = make.value
        let yearValue = year.value
        let modelValue = model.value
        let plateValue = plate.value

        let d = new Date(dateOfBirthValue)
        //validation logic 
        if(firstNameValue === ""){
            $("#error-text").text("Please enter a valid first name")
            return
        }
        else if(lastNameValue === ""){
            $("#error-text").text("Please enter a valid last name")
            return
        }
        else if(socialInsuranceNumberValue === ""){
            $("#error-text").text("Please enter a valid social insurance number")
            return
        }
        else if(sinRegExp.test(socialInsuranceNumberValue) == false){
            $("#error-text").text("Please enter a valid social insurance number")
            return
        }
        else if(d === "Invalid Date"){
            $("#error-text").text("Please enter a valid date of birth")
            return
        }
        else if(streetValue === ""){
            $("#error-text").text("Please enter a valid street name")
            return
        }
        else if(cityValue === ""){
            $("#error-text").text("Please enter a valid city name")
            return
        }
        else if(provinceValue === ""){
            $("#error-text").text("Please enter a valid province name")
            return
        }
        else if(postalCodeValue === ""){
            $("#error-text").text("Please enter a valid postal code")
            return
        }
        else if(postalRegExp.test(postalCodeValue) == false){
            $("#error-text").text("Please enter a valid postal code")
            return
        }
        else if(makeValue === ""){
            $("#error-text").text("Please enter a valid make")
            return
        }
        else if(yearValue === ""){
            $("#error-text").text("Please enter a valid year of purchase")
            return
        }
        else if(modelValue === ""){
            $("#error-text").text("Please enter a valid model number")
            return
        }
        else if(plateValue === "" || plateValue.length != 9){
            $("#error-text").text("Please enter a valid plate number")
            return
        }
        else{
            let userObject = {
                userId : sessionStorage.getItem('userid'),
                firstName : firstNameValue,
                lastName : lastNameValue,
                socialInsuranceNumber : socialInsuranceNumberValue,
                dateOfBirth : dateOfBirthValue
            }

            let addressObject = {
                street : streetValue,
                city : cityValue,
                province : provinceValue,
                postalCode : postalCodeValue
            }

            let carObject = {
                make : makeValue,
                model : modelValue,
                year : yearValue,
                plateNum : plateValue
            }
            console.log(userObject,carObject,addressObject)
            // send ajax request to create object in 3 collections
            $.ajax({
                type: "POST",
                url:`${hostname}/appointment/create`,
                data:{"data":JSON.stringify({personal : userObject,address : addressObject,car : carObject})},
                dataType : "json",
                success: function(data,status,xhr){
                    if(data['result'] == "success"){
                        alert(`Your data has been stored successfully.`)
                    }
                    else if(data['result'] == "error"){
                        if(data['reason'].includes("E11000 duplicate key error collection")){
                            alert("Your data already exists, you can update it in G Page.")
                        }
                        else{
                            alert("Your data could not be stored, please try again later")
                        }
                        
                    }
                }
            });
        }
    })
    
    view.addEventListener('click',function(){
        let date = dateField.value
        console.log(date)
        if(!date){
            $("#error-text-app").text("Date must be filled")
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
                        if(appointment.isAvailable){
                            let buttonDiv = document.createElement('div')
                            buttonDiv.className = "col-sm-6 col-md-4 col-lg-2"
                            let button = document.createElement('button')
                            button.className = "btn btn-dark mb-2"
                            button.type = "button"
                            button.id = appointment._id
                            button.innerText = `${appointment.start_time} - ${appointment.end_time}`
                            button.addEventListener('click',(e)=>{
                                e.preventDefault()
                                console.log(appointment._id)
                                $.ajax({
                                    type: "post",
                                    url: "/appointment/book",
                                    data: {
                                        "data" : JSON.stringify({"id" : appointment._id,"userid" : sessionStorage.getItem("userid"), "type" : sessionStorage.getItem("type"),"app_type" : "G2"})
                                    },
                                    dataType : "json",
                                    success: function () {
                                        view.click()
                                        alert("Appointment was successfully booked")
                                    }
                                });
                            })
                            buttonDiv.appendChild(button)
                            appointments.appendChild(buttonDiv)
                        }
                    }
                }
                else{
                    $("#error-text-app").text(response.reason)
                }
            }
        });
    })
});

// Full Stack Prog Group Project - GROUP 2