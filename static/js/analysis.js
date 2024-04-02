function getLatest(){
	fetchFunction("/api/latest",function(data){
		//console.log(data)
		var el = ""
		for(var key in data){
			el += `<p><a href="javascript:void(0)">${key}</a> : ${data[key]} </p>`
		}
		document.getElementById("latestRequest").innerHTML = `
			<div>
				<h5>${data.app}</h5>
				<p>{
					${el}
				}</p>
			</div>
		`
	})
}

function analysisDashboard(data){
	console.log(data)
	let date = new Date().toUTCString()
	function pageViews(data){
		var el = ""
		for(var dt of data){
			var e = dt[0].split("/")
			e = e[e.length-1]
			el += `
			<tr>
				<td class="text-primary" style="max-width: 55%;overflow:hidden;"><a class="link">${e}</a></td>
				<td>${dt[1] ?dt[1] > 0 : 1}</td>
				
			</tr>
			`
		}
		return el
	}
	setInterval(function(){
		getLatest()
	},2999)
    return `
    <div class="content-wrapper">
            <div class="content">

			<div class="row">
				<div class="col-md-12">
					
                          <!-- User activity statistics -->
                          <div class="card card-default" id="user-activity">
                            <div class="row no-gutters">
                              <div class="col-xl-8">
                                <div class="border-right">
                                  <div class="card-header justify-content-between py-5">
                                    <h2>User Activity</h2>
                                    <div class="date-range-report ">
                                      <span>${date}</span>
                                    </div>
                                  </div>
                                  <ul class="nav nav-tabs nav-style-border justify-content-between justify-content-xl-start border-bottom" role="tablist">
                                    <li class="nav-item">
                                      <a class="nav-link active pb-md-0" data-toggle="tab" href="#user" role="tab" aria-controls="" aria-selected="true">
                                        <span class="type-name">User</span>
                                        <h4 class="d-inline-block mr-2 mb-3">${data.users}</h4>
                                       
                                      </a>
                                    </li>
                                    <li class="nav-item">
                                      <a class="nav-link pb-md-0" data-toggle="tab" href="#session" role="tab" aria-controls="" aria-selected="false">
                                        <span class="type-name">Sessions</span>
                                        <h4 class="d-inline-block mr-2 mb-3">${data.sessions}</h4>
                                       
                                      </a>
                                    </li>
                                    <li class="nav-item">
                                      <a class="nav-link pb-md-0" data-toggle="tab" href="#bounce" role="tab" aria-controls="" aria-selected="false">
                                        <span class="type-name">Bounce Rate</span>
                                        <h4 class="d-inline-block mr-2 mb-3">${data.bounce}</h4>
                                       
                                      </a>
                                    </li>
                                    <li class="nav-item">
                                      <a class="nav-link pb-md-0" data-toggle="tab" href="#session-duration" role="tab" aria-controls="" aria-selected="false">
                                        <span class="type-name">Session Duration</span>
                                        <h4 class="d-inline-block mr-2 mb-3">${data.duration ? parseInt(data.duration) : 1}</h4>
                                       
                                      </a>
                                    </li>
                                  </ul>
                                  <div class="card-body">
                                    <div class="tab-content" id="myTabContent">
                                      <div class="tab-pane fade show active" id="user" role="tabpanel" aria-labelledby="home-tab"><div class="chartjs-size-monitor" style="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
                                          <canvas id="activity" class="chartjs chartjs-render-monitor" width="600" height="280" style="display: block; width: 600px; height: 280px;"></canvas>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="card-footer d-flex flex-wrap bg-white border-top">
                                    <a href="#" class="text-uppercase py-3">Audience Overview</a>
                                  </div>
                                </div>
                              </div>
                              <div class="col-xl-4">
                                <div>
                                  <div class="card-header pt-5 flex-column align-items-start">
                                    <h4 class="text-dark mb-4">Current Users</h4>
                                    <div class="mb-3 current-users-content">
                                      
                                    </div>
                                  </div>
                                  <div class="border-bottom"></div>
                                  <div class="card-body"><div class="chartjs-size-monitor" style="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
                                    <canvas id="currentUser" class="chartjs chartjs-render-monitor" width="270" height="283" style="display: block; width: 270px; height: 283px;"></canvas>
                                  </div>
                                  <div class="card-footer d-flex flex-wrap bg-white border-top">
                                    <a href="#" class="text-uppercase py-3">Audience Overview</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

				</div>
			</div>

			<div class="row">
				

				<div class="col-xl-6 col-12">
					
                          <!-- World Chart -->

                          <div class="card card-default" id="analytics-country">
                            <div class="card-header justify-content-between">
                              <h2>Sessions by Country</h2>
                              <div class="date-range-report ">
                                <span>Mar 11, 2024 - Mar 11, 2024</span>
                              </div>
                            </div>
                            <div class="card-body vector-map-world-2">
                              <div id="analytic-world" style="height: 100%; width: 100%;"></div>
                            </div>
                            <div class="border-top">
                              <div class="row no-gutters">
                                <div class="col-lg-6">
                                  <div class="world-data-chart border-bottom py-4"><div class="chartjs-size-monitor" style="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
                                    <canvas id="hbar1" class="chartjs chartjs-render-monitor" width="179" height="150" style="display: block; width: 179px; height: 150px;"></canvas>
                                  </div>
                                </div>
                                <div class="col-lg-6">
                                  <div class="world-data-chart py-4 "><div class="chartjs-size-monitor" style="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
                                    <canvas id="hbar2" class="chartjs chartjs-render-monitor" width="180" height="150" style="display: block; width: 180px; height: 150px;"></canvas>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="card-footer d-flex flex-wrap bg-white">
                              <a href="#" class="text-uppercase py-3">Audience Overview</a>
                            </div>
                          </div>

				</div>
			</div>

			<div class="row">
				<div class=" col-xl-4 ">
					<!-- Sessions By device Chart -->
					<div class="card card-default" id="analytics-device" analytics-data-height="">
						<div class="card-header justify-content-between">
							<h2>Sessions by Device</h2>
						</div>

						<div class="card-body">
							<div class="pb-5"><div class="chartjs-size-monitor" style="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;"><div class="chartjs-size-monitor-expand" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div></div><div class="chartjs-size-monitor-shrink" style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;"><div style="position:absolute;width:200%;height:200%;left:0; top:0"></div></div></div>
								<canvas id="deviceChart" width="249" height="230" style="display: block; width: 249px; height: 230px;" class="chartjs-render-monitor"></canvas>
							</div>

							<div class="row no-gutters justify-content-center">
								<div class="col-4 col-lg-3">
									<div class="card card-icon-info text-center border-0">
										<i class="fa-solid fa-desktop"></i>
										<p class="pt-3 pb-1">Desktop</p>
										<h4 class="text-dark pb-1">${(data.device.desktop/data.device.total)*100}</h4>
										
									</div>
								</div>

								<div class="col-4 col-lg-3">
									<div class="card card-icon-info text-center border-0">
									<i class="fa-solid fa-tablet"></i>	
										<p class="pt-3 pb-1">Tablet</p>
										<h4 class="text-dark pb-1">${(data.device.tablet/data.device.total)*100}</h4>
										
									</div>
								</div>

								<div class="col-4 col-lg-3">
									<div class="card card-icon-info text-center border-0">
									<i class="fa-solid fa-mobile"></i>
										<p class="pt-3 pb-1">Mobile</p>
										<h4 class="text-dark pb-1">${(data.device.mobile/data.device.total)*100}%</h4>
										
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class=" col-xl-4 ">
					<!-- Page Views  -->
					<div class="card card-default table-borderless" id="page-views">
						<div class="card-header justify-content-between">
							<h2>Page Views</h2>

							<div class="date-range-report ">
								<span>${date}</span>
							</div>
						</div>

						<div class="card-body py-0" data-simplebar="" style="height: 437px;">
							<table class="table page-view-table ">
								<thead>
									<tr>
										<th>Page</th>
										<th>Page Views</th>
										
									</tr>
								</thead>

								<tbody>
									
									${pageViews(data.page_views)}
								</tbody>
							</table>
						</div>

						<div class="card-footer bg-white py-4">
							<a href="#" class="text-uppercase">Audience Overview</a>
						</div>
					</div>
				</div>

				<div class=" col-xl-4 ">
					<!-- Notification Table -->
					<div class="card card-default">
						<div class="card-header justify-content-between">
							<h2>Latest Request</h2>

							<div>
								<button class="text-black-50 mr-2 font-size-20"><i class="fas fa-cached"></i></button>

								<div class="dropdown show d-inline-block widget-dropdown">
									<a class="dropdown-toggle icon-burger-mini" href="#" role="button" id="dropdown-notification" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static"></a>
									<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown-notification">
										<li class="dropdown-item"><a href="#requests">All Requests</a></li>
										<li class="dropdown-item"><a href="javascript:void(0)" onclick="getLatest()">Reload</a></li>
									</ul>
								</div>
							</div>
						</div>

						<div class="card-body py-4" data-simplebar="" style="height: 475px;overflow:auto;">
							<div class="media pb-4 align-items-center justify-content-between">
								<div class="d-flex rounded-circle align-items-center justify-content-center mr-3 media-icon iconbox-45 bg-primary text-white">
									<i class="fas fa-cart-outline font-size-20"></i>
								</div>

								<div class="media-body pr-3 " id="latestRequest" >
									
								</div>
								<span class=" font-size-12 d-inline-block"><i class="fas fa-clock-outline"></i> 10 AM</span>
							</div>

							
						</div>

						<div class="mt-3"></div>
					</div>
				</div>
			</div>





      </div> <!-- End Content -->
    </div>`
	

}
const chartFunction = (id,labels,data) =>{
	console.log("in")
	var xValues = labels;
	var yValues = data ? data : [60, 15, 25];
	var barColors = ["#FF7474", "#23274E","#28282B"];

	new Chart(id, {
	  type: "pie",
	  data: {
		labels: xValues,
		datasets: [{
		  backgroundColor: barColors,
		  data: yValues
		}]
	  },
	  options: {
		title: {
		  display: true,
		 
		}
	  }
	});
	return true
}

const barChart= (id,data) =>{
	console.log("in")
	var xValues = ["Jan","Feb","March","April","May","June","July","August","Sept","Oct","Nov","Dec"];
	var yValues = data
	var barColors = "#28282B";

	new Chart(id, {
	  type: "bar",
	  data: {
		labels: xValues,
		datasets: [{
		  backgroundColor: barColors,
		  data: yValues
		}]
	  },
	  options: {
		title: {
		  display: true,
		  text: "Total Visits"
		}
	  }
	});
	return true
}

const lineChart = (id,data) =>{
	console.log("in")
	const xValues = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

	new Chart(id, {
	type: "line",
		data: {
			labels: xValues,
			datasets: [{
			data:data[0],
			borderColor: "red",
			fill: false,
			title:"Users"
			},{
			data: data[1],
			borderColor: "green",
			fill: false,
			title:"Sessions"
			},{
			data: data[2],
			borderColor: "green",
			fill: false,
			title:"Bounce"
			}]
		},
		options: {
			legend: {display: false}
		}
	});
	return true
}

const roundedChart = (id,labels,data) =>{
	console.log("in")
	const xValues = labels;
	const yValues = data;
	const barColors = ["red", "green","blue","orange","brown"];
	new Chart(id, {
		type: "doughnut",
		data: {
		  labels: xValues,
		  datasets: [{
			backgroundColor: barColors,
			data: yValues
		  }]
		},
		options: {
		  title: {
			display: true,
			
		  }
		}
	  });
	return true
}

