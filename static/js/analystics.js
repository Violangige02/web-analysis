function appAnalysis(body,data){
	if(data === null || data === undefined){
		console.warn("Invalid data")
	}
	body.innerHTML += `<br><br>
		<div class="row">
		<div class="card card-default" id="user-activity">
		<div class="row no-gutters">
            <div class="col-xl-8">
                <div class="border-right">
                <div class="card-header justify-content-between py-5">
                    <h2>App Engagement</h2>
                    <div class="date-range-report ">
                    <span>Mar 10, 2024 - Mar 10, 2024</span>
                    </div>
                </div>
                <ul class="nav nav-tabs nav-style-border justify-content-between justify-content-xl-start border-bottom" role="tablist">
                    <li class="nav-item">
                    <a class="nav-link active pb-md-0" data-toggle="tab" href="#user" role="tab" aria-controls="" aria-selected="true">
                        <span class="type-name">Total Api Calls</span>
        
                        <span class="text-success ">5100
                        <i class="fas fa-arrow-up-bold"></i>
                        </span>
                    </a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link pb-md-0" data-toggle="tab" href="#session" role="tab" aria-controls="" aria-selected="false">
                        <span class="type-name">Successful responses</span>

                        <span class="text-success ">4200
                        <i class="fas fa-arrow-up-bold"></i>
                        </span>
                    </a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link pb-md-0" data-toggle="tab" href="#session" role="tab" aria-controls="" aria-selected="false">
                        <span class="type-name">Error responses</span>

                        <span class="text-success ">1100
                        <i class="fas fa-arrow-up-bold"></i>
                        </span>
                    </a>
                    </li>
                    
                </ul>
                <div class="card-body">
                    <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="user" role="tabpanel" aria-labelledby="home-tab"><div class="chartjs-size-monitor" style="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
                        <canvas id="apiactivity" class="chartjs chartjs-render-monitor" width="600" height="280" style="display: block; width: 600px; height: 280px;"></canvas>
                    </div>
                    </div>
                </div>
                <div class="card-footer d-flex flex-wrap bg-white border-top">
                    <a href="javascript:void(0)" class="text-uppercase py-3">Number of Api calls over time</a>
                </div>
                </div>
            </div>
            <div class=" col-xl-4 ">
                <!-- Response Time-->
                <div class="card card-default" id="analytics-device" analytics-data-height="">
                    <div class="card-header justify-content-between">
                        <h2>Response Time</h2>
                    </div>

                    <div class="card-body">
                        <div class="pb-5"><div class="chartjs-size-monitor" style="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
                            <canvas id="responseChart" width="249" height="230" style="display: block; width: 249px; height: 230px;" class="chartjs-render-monitor"></canvas>
                        </div>

                        <div class="row no-gutters justify-content-center">
                        
                        </div>
                    </div>
                </div>
            </div>
		</div>
        <div class="row">
            <div class=" col-xl-4 ">
                <div class="card card-default" id="analytics-device" analytics-data-height="">
                    <div class="card-header justify-content-between">
                        <h2>Perfomance Metrics</h2>
                    </div>

                    <div class="card-body">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Api name</th>
                                <th scope="col">Total Requests</th>
                                <th scope="col">Failed requests</th>
                            </tr>
                            </thead>
                            <tbody id="appmetrics">
                                
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>
        </div>
	</div>
	</div>
	`
    appMetrics("appmetrics")
    apiActivity("apiactivity",[])
    chartFunction("responseChart",["More than 10 seconds","5 - 10 seconds","Less than 5 seconds"],[35.3,41.7,23.5])
}

function appMetrics(id){
    fetchFunction("/getApps",function(data){
        for(const app of data.apps){
            document.getElementById(id).innerHTML += `
                <tr>
                    <th scope="row">1</th>
                    <td>${app.name}</td>
                    <td>1000</td>
                    <td>10</td>
                </tr>
        
            `
        }
    })
}

function apiActivity(id,data){
    const xValues = [1,2,3,4,5,6,7,8,9,10];

	new Chart(id, {
	type: "line",
		data: {
			labels: xValues,
			datasets: [{
			data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
			borderColor: "#23232b",
			fill: false,
			title:"Direct"
			}]
		},
		options: {
			legend: {display: false}
		}
	});
}