let feedBackRow = null;
let filterObj = {}
$(document).ready(async function () {
    if(sessionStorage.getItem("loggedin") !== "true" || sessionStorage.getItem('type') !== "examiner"){
        sessionStorage.clear()
        window.location.href="/login"
        return
    }
    const date = document.getElementById('select-date')
    const type = document.getElementById('select-type')
    const view = document.getElementById('btn-view')
    const examView = document.getElementById('exams')
    const logout = document.getElementById('logout')
    await loadData(null,examView)
    // logout.addEventListener('click',(e)=>{
    //     e.preventDefault()
    //     sessionStorage.clear()
    //     window.location = '/?function=logout'
    // })
    view.addEventListener('click',async ()=>{
        filterObj = {
            date : date.value,
            type : type.value
        }
        await loadData(filterObj,examView)
    })
})

async function loadData(filterObj,div){
    let res = {}
    $.ajax({
        type: "get",
        url: "/appointment/viewexams",
        data: filterObj === null ? {} : filterObj,
        success: function (response) {
            if(response.result == "success"){
                res = response.data
                renderView(res,div)
            }
        }
    });
}
function renderUserModal(userObj){
    let modalBody = document.getElementById('user-body')
    modalBody.innerHTML = ""
    if(userObj.reason === undefined){
        let modalHTML = `
            <p>Name : <span id="name">${userObj.firstName + " " +userObj.lastName}</span></p>
            <p>Date Of Birth : <span id="dob">${formatDate(new Date(userObj.dateOfBirth))}</span></p>
            <p>Address : <span id="street">${userObj.address.street}</span>,&nbsp;<span id="city">${userObj.address.city}</span>,&nbsp;<span id="province">${userObj.address.province}</span></p>
            <p>Postal Code : <span id="zip">${userObj.address.postalCode}</span></p>
        `
        modalBody.innerHTML = modalHTML
    }
    else{
        modalBody.innerHTML = `<h3>${carObj.reason}</h3>`
    }
}
function renderCarModal(carObj){
    let modalBody = document.getElementById('car-body')
    modalBody.innerHTML = ""
    if(carObj.reason === undefined){
        let modalHTML = `
            <p>Make : <span id="name">${carObj.make}</span></p>
            <p>Model : <span id="dob">${carObj.model}</span></p>
            <p>Year : <span id="street">${carObj.year}</span></p>
            <p>Plate Number : <span id="zip">${carObj.plateNum}</span></p>
        `
        modalBody.innerHTML = modalHTML
    }
    else{
        modalBody.innerHTML = `<h3>${carObj.reason}</h3>`
    }
}
function renderView(exams,div){
    div.innerHTML = ""
    let table = document.createElement('table')
    table.className = "table table-bordered tabled-striped table-hover mt-5"
    let thead = document.createElement('thead')
    thead.className="thead-dark"

    let date = document.createElement('th')
    date.innerText = "Date"
    thead.appendChild(date)

    let start_time = document.createElement('th')
    start_time.innerText = "Start Time"
    thead.appendChild(start_time)

    let end_time = document.createElement('th')
    end_time.innerText = "End Time"
    thead.appendChild(end_time)

    let reason = document.createElement('th')
    reason.innerText = "Type Of Exam"
    thead.appendChild(reason)

    let userDetails = document.createElement('th')
    userDetails.innerText = "User Details"
    thead.appendChild(userDetails)

    let carDetails = document.createElement('th')
    carDetails.innerText = "Car Details"
    thead.appendChild(carDetails)

    let comment = document.createElement('th')
    comment.innerText = "Feedback/Result"
    thead.appendChild(comment)

    table.appendChild(thead)
    for(let exam of exams){
        let row = document.createElement('tr')

        let date_row = document.createElement('td')
        date_row.innerText = exam.date
        row.appendChild(date_row)

        let start_time_row = document.createElement('td')
        start_time_row.innerText = exam.start_time
        row.appendChild(start_time_row)

        let end_time_row = document.createElement('td')
        end_time_row.innerText = exam.end_time
        row.appendChild(end_time_row)

        let reason_row = document.createElement('td')
        reason_row.innerText = exam.type
        row.appendChild(reason_row)

        let user_row = document.createElement('td')
        let userButton = document.createElement('button')
        userButton.type = "button"
        userButton.className = "btn btn-primary mx-auto"
        userButton.innerText = "User Details"
        userButton.id = exam.driver._id
        userButton.addEventListener('click',function(e){
            e.preventDefault()
            $.ajax({
                type: "get",
                url: "/appointment/getuser",
                data: {
                    userid : sessionStorage.getItem('userid'),
                    type : sessionStorage.getItem('type'),
                    driver_id : exam.driver._id
                },
                success: function (response) {
                    if(response.result === "success"){
                        renderUserModal(response.data[0])
                    }
                    else{
                        renderUserModal(response)
                    }
                    $("#userModal").modal('show')
                }
            });
            
            console.log('View user details for '+exam.driver._id)
        })
        user_row.appendChild(userButton)
        row.appendChild(user_row)

        let car_row = document.createElement('td')
        let carButton = document.createElement('button')
        carButton.type = "button"
        carButton.className = "btn btn-primary mx-auto"
        carButton.innerText = "Car Details"
        carButton.id = exam.driver.carId
        carButton.addEventListener('click',function(e){
            e.preventDefault()
            $.ajax({
                type: "get",
                url: "/appointment/getcar",
                data: {
                    userid : sessionStorage.getItem('userid'),
                    type : sessionStorage.getItem('type'),
                    search : exam.driver.carId
                },
                success: function (response) {
                    if(response.result === "success"){
                        renderCarModal(response.data)
                    }
                    else{
                        renderCarModal(response)
                    }
                    $("#carModal").modal('show')
                }
            });
            console.log('View car details for '+exam.driver.carId)
        })
        car_row.appendChild(carButton)
        row.appendChild(car_row)
        let feedback_row = document.createElement('td')
        let feedbackButton = document.createElement('button')
        feedbackButton.type="button"
        feedbackButton.disabled = exam.isGraded
        feedbackButton.className = "btn btn-primary mx-auto"
        feedbackButton.innerText = "Provide Feedback"
        feedbackButton.id = exam._id
        feedbackButton.addEventListener('click',function(e){
            e.preventDefault();
            $("#feedbackModal").modal('show')
            feedBackRow = exam._id
            console.log("Attempt to provide feedback for "+exam._id)
        })
        feedback_row.appendChild(feedbackButton)
        row.appendChild(feedback_row)
        table.appendChild(row)
    }
    div.appendChild(table)
}

function formatDate(str){
    let date = new Date(str)
    let pad = (v) => { return v > 9 ? v : "0"+v }
    return date.getFullYear()+"-"+pad(date.getMonth()+1)+"-"+pad(date.getDay())
}

function submitFeedback(){
    console.log(feedBackRow)
    let status = document.getElementById('status-select')
    let comments = document.getElementById('comments')
    
    let statusVal = status.value
    let commentVal = comments.value

    if(!statusVal){
        alert("Status Must be filled before submitting")
        return
    }

    let obj = {
        app_id : feedBackRow,
        status : statusVal == "pass" ? true : false,
        comments : commentVal,
        userid : sessionStorage.getItem("userid"),
        type : sessionStorage.getItem("type")
    }
    
    $.ajax({
        type: "post",
        url: "/appointment/updatestatus",
        data: {data : JSON.stringify(obj)},
        dataType: "json",
        success: async function (response) {
            if(response.result == "success"){
                $("#feedbackModal").modal('hide')
                alert("Record has been successfully updated. ")
                $("#feedback-form").trigger('reset')
                feedBackRow = null
                await loadData(filterObj,document.getElementById('exams'))
            }else{
                alert(`${response.reason}`)
            }
        }
    });
}

// Full Stack Prog Group Project - GROUP 2