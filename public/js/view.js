$(document).ready(function () {
    if(sessionStorage.getItem("loggedin") !== "true" || sessionStorage.getItem('type') != "driver"){
        sessionStorage.clear()
        window.location.href="/login"
        return
    }
    const appointmentTable = document.getElementById('appointments')
    $.ajax({
        type: "post",
        url: "/appointment/viewbyuser",
        data: {"data" : JSON.stringify({"userid" : sessionStorage.getItem("userid"),"type" : sessionStorage.getItem("type")})},
        dataType: "json",
        success: function (response) {
            console.log(response.result)
            if(response.result == "success"){
                console.log(response)
                let table = document.createElement('table')
                table.className = "table table-bordered tabled-striped table-hover"
                let thead = document.createElement('thead')
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
                reason.innerText = "Type of Appointment"
                thead.appendChild(reason)
                
                let status = document.createElement('th')
                status.innerText = 'Status of exam'
                thead.appendChild(status)

                let cancel = document.createElement('th')
                cancel.innerText = "Cancel Appointment"
                thead.appendChild(cancel)

                table.appendChild(thead)
                for(let appointment of response.data){
                    let row = document.createElement('tr')

                    let date_row = document.createElement('td')
                    date_row.innerText = appointment.date
                    row.appendChild(date_row)

                    let start_time_row = document.createElement('td')
                    start_time_row.innerText = appointment.start_time
                    row.appendChild(start_time_row)

                    let end_time_row = document.createElement('td')
                    end_time_row.innerText = appointment.end_time
                    row.appendChild(end_time_row)

                    let reason_row = document.createElement('td')
                    reason_row.innerText = appointment.type
                    row.appendChild(reason_row)

                    let status_row = document.createElement('td')
                    if(appointment.isGraded === false && appointment.isPublished === false){
                        status_row.innerText = "Not yet graded"
                    }
                    else if(appointment.isGraded === true && appointment.isPublished === false){
                        status_row.innerText = "Graded but not published"
                    }
                    else if(appointment.isGraded === true && appointment.isPublished === true){
                        let anchor = document.createElement('button')
                        anchor.type="button"
                        anchor.className = "btn btn-primary mx-auto"
                        anchor.innerText = "View Results"
                        anchor.id = appointment._id
                        anchor.addEventListener('click',function(e){
                            e.preventDefault();
                            let status = document.getElementById('status-text')
                            let comments = document.getElementById('comments')
                            status.value = appointment.passFailStatus == true ? "PASS" : "FAIL"
                            comments.value = appointment.comment
                            $("#result-modal").modal("show")
                        })
                        status_row.appendChild(anchor)
                    }
                    row.appendChild(status_row)

                    let cancel_row = document.createElement('td')
                    let cancelButton = document.createElement('button')
                    cancelButton.type="button"
                    cancelButton.className = "btn btn-primary mx-auto"
                    cancelButton.innerText = "Cancel"
                    cancelButton.disabled = appointment.isGraded // once graded appointment cannot be cancelled
                    cancelButton.id = appointment._id
                    cancelButton.addEventListener('click',function(e){
                        console.log('works')
                        $.ajax({
                            type: "post",
                            url: "/appointment/cancel",
                            data: {
                                "data" : JSON.stringify({"app_id" : appointment._id,"user" : sessionStorage.getItem("userid"),"type" : sessionStorage.getItem("type")})
                            },
                            dataType: "json",
                            success: function (response) {
                                if(response.result === "success"){
                                    window.location.reload()
                                }else{
                                    alert(response.reason)
                                }
                            }
                        });
                    })
                    cancel_row.appendChild(cancelButton)
                    row.appendChild(cancel_row)
                    table.appendChild(row)
                }
                appointmentTable.appendChild(table)
            }
            else if(response.result === "error"){
                alert(response.reason)
            }
        }
    });
});

// Full Stack Prog Group Project - GROUP 2