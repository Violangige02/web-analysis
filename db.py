import pymongo
from datetime import datetime

myclient = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = myclient["net_analysis"]

class myDB:
    def __init__(self):
        self.check_collection()
       
    def check_collection(self):
        self.users = mydb["users"]
        self.apps = mydb["apps"]
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
    def get_app(self,id):
        x = self.apps.find_one({'key':id})
        return x
    
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
    
