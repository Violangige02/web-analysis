
function isInCurrentWeek(date) {
    // Get the current date
    var currentDate = new Date();

    // Calculate the start date of the current week (Sunday)
    var sunday = new Date(currentDate);
    sunday.setDate(currentDate.getDate() - currentDate.getDay());

    // Calculate the end date of the current week (Saturday)
    var saturday = new Date(currentDate);
    saturday.setDate(currentDate.getDate() - currentDate.getDay() + 6);

    // Check if the date falls within the current week
    return date >= sunday && date <= saturday;
}

function adminDashboard(){
    
    fetchFunction("/api/getAnalysis",function(data){
        const body = document.getElementById("main");
        console.log(data)
        const device = {desktop: 0,mobile: 0,tablet:0,total: 0}
        const page_views = []
        const pages = []
        const page_data =  []
        const countries = []
        const country_total = []
        const country_data = []
        var users = 0
        var session = 0
        var duration = 0
        var bounce = 0
        const days = [0,0,0,0,0,0,0]
        const session_days =  [0,0,0,0,0,0,0]
        const bounce_days =  [0,0,0,0,0,0,0]
        const months = [0,0,0,0,0,0,0,0,0,0,0,0]
        //const timer = {monday:0,tuesday:0,wednesday:0,thursday:0,friday:0,saturday:0,sunday0}
        for(var dat of data){
            device.desktop += dat.devices.desktop
            device.mobile += dat.devices.mobile
            device.tablet += dat.devices.tablet
            device.total += dat.devices.total 
            for(var dt of dat.data){
                if(dt.pathname && !pages.includes(dt.pathname)){
                    pages.push(dt.pathname)
                    page_views.push(0)
                }else if(dt.pathname && pages.includes(dt.pathname)){
                    
                    let index = pages.indexOf(dt.pathname)
                    page_views[index] += 1
                }
                if(dt.country){
                    if(!countries.includes(dt.country)){
                        countries.push(dt.country)
                        country_total.push(0)
                    }
                    let index = countries.indexOf(dt.country)
                    country_total[index] += 1
                }
                if(dt.ip){
                    users += 1
                    const ldtime = dt.loadTime/1000
                    if(dt.duration !== undefined){
                        if(dt.duration > 10){
                            session += 1
                            if(dt.update && isInCurrentWeek(dt.update)){
                                var det = new date(dt.update)
                                session_days[det.getDay()] += 1
                            }
                        }else{
                            bounce += 1
                            if(dt.update && isInCurrentWeek(dt.update)){
                                var det = new date(dt.update)
                                bounce_days[det.getDay()] += 1
                            }
                        }
                        duration += dt.duration
                    }else{
                        bounce += 1
                    }
                    if(dt.date && isInCurrentWeek(dt.date)){
                        var date = new date(dt.date)
                        days[date.getDay()] += 1
                    }else{
                        var date = new Date(dt.date)
                        months[date.getMonth()] += 1
                    }
                }
            }
            duration = duration/session
            
            for(var e of pages){
                let index = pages.indexOf(e)
                if(!page_data.includes([e,page_views[index]])){
                    page_data.push([e,page_views[index]])
                }
                
            }
            for(var c of countries){
                let index = countries.indexOf(c)
                country_data.push([c,country_total[index]])
            }
           
        }
        const new_data = {}
        new_data.device = device
        new_data.page_views = page_data
        new_data.countries = country_data
        new_data.users = users
        new_data.sessions = session
        new_data.bounce = bounce
        new_data.duration = duration
        body.innerHTML = `
        <div class="pt-3 pb-2 mb-3 border-bottom">
            <h2>Admin Dashboard</h2>
        </div>
        <div class="main-content">
            ${analysisDashboard(new_data)}
        </div>
        `
        setTimeout(function(){
            lineChart("activity",[days,session_days,bounce_days])
            chartFunction("deviceChart",["Laptop","Tablet","Mobile"],[device.laptop,device.tablet,device.mobile])
            barChart("currentUser",months)
           // lineChart("acquisition")
            roundedChart("hbar1",countries,country_total)
    
        },1119)
        chartFunction("deviceChart",["Laptop","Tablet","Mobile"],[1,1,1])
    })
    
   
    
}

function applicationManagement(){
    const body = document.getElementById("main")
    body.innerHTML = `
    <div class="pt-3 pb-2 mb-3 border-bottom">
        <h2>Application Managment</h2>
    </div>
    <div class="add-app"><button class="button-8" role="button" onclick="appModal()" data-toggle="modal" data-target="#appModal">Create App</button></div>
    <div class="main-content">
        <h6>Your Applications:</h6>
        <div class="flexdisplay" id="myApps">
       
        </div>
    </div>
    `
    myApplications()
}

function changeAnalysis(id){
    fetchFunction("/api/trackAnalysis/"+id,appAnalysis)
}

function adminAnalystics(){
    const body = document.getElementById("main")
    body.innerHTML = `
    <div class="pt-3 pb-2 mb-3 border-bottom" >
        <h2>App Analystics</h2>
        <div id="analysispage"></div>
        <div id="analysis"></div>
    </div>
    `
    fetchFunction("/getApps",function(data){
        document.getElementById("analysis").innerHTML = ''
        const select = document.createElement("div")
        select.setAttribute("style","max-width: 65%;")
        let html = ''
        let app = null
        for(var data of data.apps){
            html += `<option value='${data.key}'>${data.name}</option>`
            if(app===null){app=data.key}
        }
        select.innerHTML = `
        <select class="form-select" onchange="changeAnalysis(this.value)" id="changeAnalysis">
            ${html}
        </select>
        `
        console.log(app)
        document.getElementById("analysispage").appendChild(select)
        $("#changeAnalysis").change(function(){
            var id = $(this).val()
            fetchFunction("/api/trackAnalysis/"+id,appAnalysis)
        })
        fetchFunction("/api/trackAnalysis/"+app,appAnalysis)
       
    })
    
}

function adminSettings(){
    const body = document.getElementById("main")
    body.innerHTML = `
    <div class="pt-3 pb-2 mb-3 border-bottom">
        <h2>Admin Settings</h2>
    </div>
    `
}
