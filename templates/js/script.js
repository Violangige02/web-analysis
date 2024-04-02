
var appurl = '{{url}}'
if(!appurl.includes('http')){
    appurl = 'http://'+appurl
}
async function aappFetchFunction(apiUrl,payload, method,nextFunction) {
    try {

      const appkey = '{{id}}'
      const options = {
        method: method || 'GET', // Default to GET if method is not provided
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          "x-auth-token": appkey
        }
      };
  
      if (payload) {
        options.body = JSON.stringify(payload); // Include payload in request body if provided
      }
      if(!apiUrl.includes("http")){
        apiUrl = appurl+apiUrl 
      }
      const response = await fetch(apiUrl, options);
    
      const data = await response.json();
      nextFunction(data); // Send data to the next function
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }


const appid = "{{id}}"
let dt = JSON.stringify({{application}})

const application = JSON.parse(dt)

var ip_address = null
var ip_info = {}
const ip_key = "d6011f0bfe1b31c177948912cf0b51da"

function getIp(data){

    ip_address = data
    
}

function getInfo(){
    
    var pageUrl = window.location.href;
    var pageTitle = document.title;
    var referrer = document.referrer;
    var pathname = window.location.pathname
    var timestamp = new Date()
    // User environment
    var userAgent = navigator.userAgent;
    var screenResolution = window.screen.width + "x" + window.screen.height;
    var timezoneOffset = new Date().getTimezoneOffset();
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    return {
        ip_address: ip_address,
        ip_detail: ip_info,
        pageUrl: pageUrl,
        pageTitle:pageTitle,
        referrer: referrer,
        pathname:pathname,
        timestamp:timestamp,
        userAgent:userAgent,
        screenResolution: screenResolution,
        timezoneOffset:timezoneOffset,
        os: navigator.platform,
        browser: navigator.appName,
        browserversion:navigator.appVersion,
        viewport: window.innerWidth + "x" + window.innerHeight,
        isTouchDevice:isTouchDevice,
    }
}
var startTime = new Date().getTime();

window.addEventListener('load', function() {
    
      window.onbeforeunload = function() {  
          var endTime = new Date().getTime();
          
          var duration = endTime - startTime;
          var payload = {
              loadTime: new Date() - performance.timing.navigationStart,
              info: getInfo(),
              duration:duration,
          };
          sendData(payload)
         
      };
    aappFetchFunction("/get_ip",null,"post",function(data){
        getIp(data)
        var payload = {
            loadTime: new Date() - performance.timing.navigationStart,
            info: getInfo(),
            // Other timing data...
        };
        sendData(payload)
    })
    
});

window.addEventListener('popstate', function(event) {
     var endTime = new Date().getTime();
          
     var duration = endTime - startTime;
     aappFetchFunction("/get_ip",null,"post",function(data){
        getIp(data)
        var payload = {
            loadTime: new Date() - performance.timing.navigationStart,
            info: getInfo(),
            duration:duration,
        };
        sendData(payload)
    })
});


// Error tracking
window.onerror = function(message, source, lineno, colno, error) {
    var endTime = new Date().getTime();
          
    var duration = endTime - startTime;
    var errorData = {
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error,
        loadTime: new Date() - performance.timing.navigationStart,
        info:getInfo(),
        duration:duration,
    };
    sendData(errorData)
};

function sendData(data){
    //data = JSON.stringify(data)
    if(ip_address === null){
      aappFetchFunction("/get_ip",null,"post",function(data){
          getIp(data)
          var payload = {
              loadTime: new Date() - performance.timing.navigationStart,
              info: getInfo(),
              duration:duration,
          };
          sendData(payload)
      })
      return
    }
    aappFetchFunction("/api/trackAnalysis",data,"post",function(dat){
      console.log(dat)
    })
}
aappFetchFunction("/get_ip",null,"post",function(data){
  getIp(data)
})
setInterval(() => {
      var payload = {
          loadTime: new Date() - performance.timing.navigationStart,
          info: getInfo(),  
          // Other timing data...
      };
      sendData(JSON.stringify(payload))
}, 30000);
