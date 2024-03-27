<script>
var appurl = '{{url}}'
if(!appurl.includes('http')){
    appurl = 'http://'+appurl
}
async function fetchFunction(apiUrl,payload, method,nextFunction) {
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

var ip_address = {}
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
    fetchFunction("/get_ip",null,"post",getIp)
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
    }
}

window.addEventListener('load', function() {
    fetchFunction("/get_ip",null,"post",function(data){
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
     fetchFunction("/get_ip",null,"post",function(data){
        getIp(data)
        var payload = {
            loadTime: new Date() - performance.timing.navigationStart,
            info: getInfo(),
            // Other timing data...
        };
        sendData(payload)
    })
});


// Error tracking
window.onerror = function(message, source, lineno, colno, error) {
    var errorData = {
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error,
        info:getInfo(),
    };
    sendData(errorData)
};

function sendData(data){
    console.log(data)
    fetchFunction("/api/trackAnalysis",data,"post",function(dat){
      console.log(dat)
    })
}
setInterval(() => {
  fetchFunction("/get_ip",null,"post",function(data){
      getIp(data)
      var payload = {
          loadTime: new Date() - performance.timing.navigationStart,
          info: getInfo(),  
          // Other timing data...
      };
      sendData(payload)
  })
}, 3000);
</script>

