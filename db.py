import pymongo
from datetime import datetime
import json
myclient = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = myclient["net_analysis"]

def parse_user_agent(user_agent):
    if 'Mobile' in user_agent:
        return 'Mobile Device'
    elif 'Tablet' in user_agent:
        return 'Tablet Device'
    elif 'Windows Desktop' in user_agent:
        return 'Windows Desktop'
    elif 'Macintosh Desktop' in user_agent:
        return 'Mac Desktop'
    else:
        return 'Unknown Device'

class myDB:
    def __init__(self):
        self.check_collection()
        #self.update_col()
    def check_collection(self):
        self.users = mydb["users"]
        self.apps = mydb["apps"]
        self.track = mydb["track"]
        self.loadTime = mydb["loadtime"]
    def update_col(self):
        xs = self.track.update_many({},{'$set': {'count': 0}})
        print('Number of documents updated:', xs.modified_count)
    def current_time(self):
        return datetime.now()
    def create_user(self,user):
        x = self.users.insert_one(user)
        return x.inserted_id
    def get_user(self,user):
        x = self.users.find_one(user,{ "_id": 1})
        print(x)
        if x != None:
            return x['_id']
        return x
    def create_app(self,id,name,key):
        x = self.apps.find_one({'user':id,'name':name})
        if x:
            return False
        x = self.apps.insert_one({'user':id,'name':name,'key':key,'date':self.current_time()})
        if x:
            return True
        return False
    def get_apps(self,user):
        apps = []
        x = self.apps.find({'user':user})
        for i in x:
            if(i.get("date") == None):
                i["date"] = self.current_time()
            
            apps.append(i)
        return apps
    def get_ip(self,app=None,ip=None):
        x = self.track.find_one({
            'app':app,'ip':ip
        })
        if x:
            return x['_id']
        return False
    def new_ip(self,app,ip):
        x = self.track.insert_one({
            'app':app,'ip':ip,'count':0,'failed':0,'date':self.current_time()
        })
        return x.inserted_id
    def update_track(self,data,app=None,ip=None):
        current = self.track.find_one({
            'app':app,'ip':ip
        })
        try:
            old_data = data
            loadTime = data["loadTime"]
            duration = data.get("duration") if data.get("duration") else 0
            

            data = data["info"]
            ip = ip
            app = app
            ip_detail = data["ip_address"]["detail"]
            country_code = ip_detail["country_code"]
            country = ip_detail["country_name"]
            city = ip_detail["city"]
            page_url = data["pageUrl"]
            page_title = data["pageTitle"]
            page_referrer = data["referrer"]
            pathname = data["pathname"]
            agent = data["userAgent"]
            os = data["os"]
            browser = data["browser"]
            browser_version = data["browserversion"]
            resolution = data["screenResolution"]
            viewport = data["viewport"]
            touch = data['isTouchDevice']
            device = parse_user_agent(browser_version)
            update = {
                'count':current["count"]+1,
                'device':device,
                'touchDevice':touch,
                'os':os,
                'browser':browser,
                'agent':agent,
                'pathname':pathname,
                'referrer':page_referrer,
                'title':page_title,
                'url':page_url,
                'country':country,
                'city':city,
                'loadTime':loadTime,
                'duration':duration,
                'updated':self.current_time()
            }
            if old_data.get("error"):
                update["error"]  = data['error']
                update["message"]  = data['message']
                update["source"]  = data['source']
            
            track = self.track.update_one({'app':app,'ip':ip},{'$set':update})
            self.apps.update_one({'key':app},{'$set':{'count':current["count"]+1}})
            self.loadTime.insert_one({'app':app,'ip':ip,'track':current['_id'],'loadTime':loadTime,'date':self.current_time()})
        except Exception as e:
            update = {'count':current["count"]+1,'failed':current["failed"]+1,'updated':self.current_time()}
            print("error->update_track",str(e))
            track = self.track.update_one({'app':app,'ip':ip},{'$set':update})
            self.apps.update_one({'key':app},{'$set':update})
        print(ip)
        return track
    def get_app(self,key):
        x = self.apps.find_one({'key':key})
        if x:
            y = self.track.find_one({'app':key})
            
        return x
    def track_app(self,app=None,period=None,ip=None):
        app_data = self.get_app(app)
        app_data = json.loads(json.dumps(app_data,default=str))
        data = {'data':[],'app':app_data}
        all = self.track.find({'app':app})
        total = 0
        error = 0
        failed = 0
        devices = {"mobile":0,"tablet":0,"desktop":0,"other":0,'total':0}
        response = {"above":0,"mid":0,"below":0,'time':10}
        loadTime = []
        for i in all:
            ltm = self.loadTime.find({'app':app,'ip':ip})
            if ltm:
                for lt in ltm:
                    loadTime.append(lt)
            total += i['count']
            if i['failed'] != 0:
                failed += i['failed']
            if i.get("error") != None:
                error += 1
            if i.get("device") != None:
                device = i.get("device")
                if "mobile" in device.lower():
                    devices["mobile"] += 1
                elif "tablet" in device.lower():
                    devices["tablet"] += 1
                elif "desktop" in device.lower():
                    devices["tablet"] += 1
                else:
                    devices["other"] += 1
                devices["total"] += 1
            if i.get("loadTime"):
                lt = i.get("loadTime")
                lt = float(lt)/1000
                if lt > 10:
                    response["above"] += 1
                elif lt < 5:
                    response["below"] += 1
                elif lt < 5 and lt < 10:
                    response["mid"] += 1 
            data["data"].append(i)
        data["total"] = total
        data["error"] = error
        data["failed"] = failed
        data['devices'] = devices
        data["response"] = response
        data["loadTime"] = loadTime
        return data
        pass
    
def getApps(user):
    if user == None:
        return []
    db = myDB()
    result = db.get_apps(user)
    if result:
        return result
    return []

def getApp(id):
    db = myDB()
    result = db.get_app(id)
    if result:
        return result
    return False
    
def createApp(user,name=None,key=None):
    if user == None or name==None or key == None:
        return False
    db = myDB()
    result = db.create_app(user,name,key)
    if result:
        return result
    return False

def Login(username,password):
    #handle lof=gin function and return either true or false
    db = myDB()
    result = db.get_user({username:username,password:password})
    if result:
        return result
    return False
def Register(username,password,email):
    db = myDB()
    if db.get_user({username:username}):
        return False
    db.create_user({username:username,email:email,password:password})
    return True
    
def trackApp(app=None,data=None):
    if app:
        db = myDB()
        result = db.get_app(app)
        if result:
            ip_address = data["info"]["ip_address"]
            ip = ip_address["address"]
            get_ip = db.get_ip(app=app,ip=ip)
            if get_ip:
                res =db.update_track(data,app=app,ip=ip)
                return True
            else:
                new_ip = db.new_ip(app=app,ip=ip)
                if new_ip:
                    res = db.update_track(data,app=app,ip=ip)
                    return True
            return False
            

def appAnalysis(app=None):
    if app:
        db = myDB()
        result  = db.get_app(app)
        if result:
            analysis = db.track_app(app=app,period=None,ip=None)
            return analysis
        