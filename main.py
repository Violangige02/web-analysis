from flask import Flask,render_template, request, session, jsonify,redirect
from db import Login,Register,createApp,getApps,getApp,trackApp,appAnalysis,getRequests,getRequest
import json
import requests
from keys import Key
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app)

app.secret_key = "secret key"
SERVER_NAME = 'http://localhost:5000'
ip_key = "d6011f0bfe1b31c177948912cf0b51da"
@app.route("/get_ip",methods=["POST","GET"])
def get_ip():
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    details = requests.get("http://api.ipstack.com/"+ip_address+"?access_key="+ip_key)
    details = json.loads(details.content)
    #print(details)
    return json.dumps({'address':ip_address,"detail":details})

@app.route("/api/getAnalysis")
def myAnalysis():
    if session.get("user") == None:
        return redirect("logout")
    result = []
    res = getApps(session.get("user"))
    for app in res:
        analysis = appAnalysis(app=app['key'])
        result.append(analysis)
    result = json.loads(json.dumps(result,default=str))
    return jsonify(result)

@app.route("/api/trackAnalysis/<string:id>",methods=["POST","GET"])
def get_analysis(id):
    app = id
    result = getApp(app)
    if result == False:
        return jsonify({message:"App not found"})
    
    analysis = appAnalysis(app=app)
    analysis = json.loads(json.dumps(analysis,default=str))
    
    return jsonify(analysis)

@app.route("/api/request/<string:id>")
def get_request(id):
    headers = request.headers
    result = getRequest(id)
    
    if result:
        result = json.loads(json.dumps(result,default=str))
    return jsonify(result)

@app.route("/api/get_requests")
def get_requests():
    headers = request.headers
    apps = getApps(session.get("user"))
    res = []
    for ap in apps:
        re = getRequests(ap['key'])
        
        res.append(re[0])
    
    res = json.loads(json.dumps(res,default=str))
    return jsonify(res)

@app.route("/api/latest")
def get_latest():
    headers = request.headers
    apps = getApps(session.get("user"))
    app_key = random.choice(apps) if len(apps) > 0 else None
    app_key = app_key["key"]
    res = trackApp(app=app_key,latest=True)
    res = json.loads(json.dumps(res,default=str))
    #print(res,app_key)
    return jsonify(res)

@app.route("/api/trackAnalysis",methods=["POST"])
def track_analysis():
    headers = request.headers
    app_key = headers.get('x-auth-token')
    print(app_key)
    if request.json:
        
        data = request.json
        try:
            data = json.loads(data)
        except Exception as e:
            pass
     
        if data.get("info"):
            trackApp(app=app_key,data=data)
    return jsonify({})

@app.route("/scripts/js/<id>.js",methods=["GET","POST"])
def getScript(id):
    id = id
    url = SERVER_NAME
    application = getApp(id)
    if application is False:
        return {"error": "App not found",'code':404}
    application = json.dumps(application, default=str)
    rendered_script = render_template("js/script.js",**locals())
    return rendered_script, 200, {'Content-Type': 'text/javascript'}

@app.route("/")
def landing():
    return redirect("login")
    #return render_template("user.html")

@app.route('/track', methods=['POST'])
def track():
    data = request.json
    # Process and store analytics data here
    print('Received analytics data:', data)
    return 'Received analytics data', 200

@app.route("/getApps")
def myApps():
    if session.get("user") == None:
        return redirect("logout")
    result = {}
    res = getApps(session.get("user"))
    result["apps"] = json.loads(json.dumps(res, default=str))
    return jsonify(result)
    
@app.route("/logout")
def logout():
    session.clear()
    return redirect("login")

@app.route("/admin",methods=["POST","GET"])    
@app.route("/dashboard",methods=["POST","GET"])
def dashboard():
    if session.get("user") == None:
        return redirect("logout")
    msg = None
    if request.method == "POST":
        if "AppName" in request.form:
            appName = request.form["AppName"]
            key = Key()
            result = createApp(session.get("user"),name=appName,key=key())
            if result != False:
                msg = "App created success"
            else:
                msg ="App creation failed"
    return render_template("dash.html",**locals())

@app.route("/signup",methods=["POST","GET"])    
@app.route("/register",methods=["POST","GET"])
def register():
    msg = None
    if request.method == "POST":
        username= request.form["username"]
        email= request.form["email"]
        password= request.form["password"]
        confirmpassword= request.form["confirm-password"]
        if password != confirmpassword:
            msg = "Password do not match"
            return render_template("register.html",msg =msg)

        result = Register(username,password,email)
        print(result)
        if result != False:
            msg = "Success"
            return redirect("/login")
        msg = "User Already Exists"
    return render_template("register.html",msg =msg)

    
@app.route("/login",methods=["POST","GET"])
def login():
    msg = None
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        result = Login(username,password)
        print("res",str(result))
        if result != False:
            print(str(result))
            session["user"] = str(result)
            return redirect("/dashboard")
        msg = "Invalid Credentials"
    return render_template("login.html",msg =msg)

if __name__ == '__main__':
    app.run("0.0.0.0",debug=True)