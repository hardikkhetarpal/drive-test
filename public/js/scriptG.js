$(document).ready(function(){
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
    //const licenseNumber = document.getElementById('license')
    const street = document.getElementById('street')
    const city = document.getElementById('city')
    const province = document.getElementById('prov')
    const postalCode = document.getElementById('post')
    const make = document.getElementById('make')
    const model = document.getElementById('model')
    const year = document.getElementById('year')
    const plateNum = document.getElementById('plate')
    const carImages = document.getElementById('images')
    const submitImages = document.getElementById('upload-images')
    const fetchLicenseDetails = document.getElementById('fetch')
    const updateDetails = document.getElementById('updateg')
    const sinFetch = document.getElementById('sinfetch')
    const dateField = document.getElementById('select-date')
    const view = document.getElementById('btn-view')
    const appointments = document.getElementById('appointments')
    //let carId = document.getElementById('car_id')
    let [personal,car,address] = [{},{},{}]
    // logout.addEventListener('click',(e)=>{
    //     e.preventDefault()
    //     sessionStorage.clear()
    //     window.location = '/?function=logout'
    // })
    fetchLicenseDetails.addEventListener('click',(e)=>{
        let sinRegExp = /^(\d{3}-\d{3}-\d{3})|(\d{9})$/
        let sinValue = sinFetch.value
        if(sinValue == ""){
            $("#error-fetch-text").text("Please enter a valid social insurance number")
            return
        }
        else if(sinRegExp.test(sinValue) == false){
            $("#error-fetch-text").text("Please enter a valid social insurance number")
            return
        }
        $.ajax({
            type: "POST",
            url: `${hostname}/appointment/read`,
            data: {"data" : JSON.stringify({"filter": { "socialInsuranceNumber" : sinValue }, "userid" : sessionStorage.getItem("userid"), "type" : sessionStorage.getItem("type")})},
            dataType : "json",
            success: function (response) {
                if(response.result == "success"){
                    if(response.data.length === 0){
                        $("#error-fetch-text").text("No user corresponding to that SIN was found. Please use the correct SIN and try again")
                        location.href= "/g2test"
                        //update address in text box
                        firstName.value = ""
                        lastName.value = ""
                        dateOfBirth.value = ""
                        socialInsuranceNumber.value = ""
                        //prevent change
                        //licenseNumber.value = personal.licenseNumber
                        firstName.disabled = true
                        lastName.disabled = true
                        dateOfBirth.disabled = true
                        socialInsuranceNumber.disabled = true
                        //show address details
                        street.value = ""
                        city.value = ""
                        province.value = ""
                        postalCode.value = ""
                        //show car details
                        make.value = ""
                        model.value = ""
                        year.value = ""
                        plateNum.value = ""
                        return
                    }
                    else{
                        $("#error-fetch-text").text("")
                    }
                    let resp = response.data[0]
                    car = resp.car
                    address = resp.address
                    //update address in text box
                    firstName.value = resp.firstName
                    lastName.value = resp.lastName
                    dateOfBirth.value = formatDate(resp.dateOfBirth)
                    socialInsuranceNumber.value = resp.socialInsuranceNumber
                    //prevent change
                    //licenseNumber.value = personal.licenseNumber
                    firstName.disabled = true
                    lastName.disabled = true
                    dateOfBirth.disabled = true
                    socialInsuranceNumber.disabled = true
                    //show address details
                    street.value = address.street
                    city.value = address.city
                    province.value = address.province
                    postalCode.value = address.postalCode
                    //show car details
                    make.value = car.make
                    model.value = car.model
                    year.value = car.year
                    plateNum.value = car.plateNum
                }
                else{
                    console.log(response.reason)
                    alert("There has been some kind of error, please try again.")
                }
            }
        });
    })

    updateDetails.addEventListener('click',(e)=>{

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
            // do not allow update without read first
            if(socialInsuranceNumberValue === ""){
                alert('Please fetch license details before proceeding further')
                return
            }
            // all form field validations
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
                //initialize with previous data
                let addressUpdateObject = address
                //update latest data of address
                addressUpdateObject.street = street.value
                addressUpdateObject.city = city.value
                addressUpdateObject.province = province.value
                addressUpdateObject.postalCode = postalCode.value
                //initialize with previous data
                let carUpdateObject = car
                //update latest data of car
                carUpdateObject.make = make.value
                carUpdateObject.model = model.value
                carUpdateObject.year = year.value
                carUpdateObject.plateNum = plateNum.value

                //send ajax request
                $.ajax({
                    type: "post",
                    url: `${hostname}/appointment/update`,
                    data: {"data" : JSON.stringify({car_id : car._id, car : carUpdateObject,address_id : address._id, address : addressUpdateObject})},
                    dataType: "json",
                    success: function (response) {
                        if(response['result'] == "success"){
                            alert("Your data has been successfully updated")
                        }
                        else{
                            console.log(response['reason'])
                            alert("Data could not be updated. Please try again later.")
                        }
                    }
                });
            }
    })
    // upload images
    submitImages.addEventListener('click',(e)=>{
        let fileList = carImages.files
        if(!car._id){
            e.preventDefault()
            alert('Please fetch license details before uploading images.')
            return
        }
        if(fileList.length < 2){
            e.preventDefault()
            alert("Please upload atleast 2 images of the car, you will be taking the test in.")
            return
        }
        //create synthetic multi-part form data for ajax request
        let formData = new FormData()
        formData.append("car_id",car._id)
        for(let file of fileList){
            formData.append(`image-${file.name}`,file)
        }
        $.ajax({
            type: "POST",
            url: `${hostname}/appointment/setimages`,
            data: formData,
            contentType:false,
            processData : false,
            success: function (response) {
                if(response.result === "success"){
                    console.log(car.images)
                    if(car.images == undefined){
                        alert("Successfully added new images")
                    }
                    else{
                        alert("Succesfully updated new images")
                    }
                }
            }
        });
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
                                        "data" : JSON.stringify({"id" : appointment._id,"userid" : sessionStorage.getItem("userid"), "type" : sessionStorage.getItem("type"),"app_type" : "G"})
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
    function formatDate(date){
        function pad(i){
            return i >= 10 ? i : "0"+i 
        }
        let d = new Date(date)
        return d.getUTCFullYear()+"-"+pad(d.getUTCMonth()+1)+"-"+pad(d.getUTCDate());
    }

})

// Full Stack Prog Group Project - GROUP 2