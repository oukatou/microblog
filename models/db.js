const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'wb';
const client = new MongoClient(url);
class Db{
    constructor(){
        this.db = ''
        //this.connect()
    }
    static getInstance(){
        if (!Db.instance){
            Db.instance = new Db;
        }
        return Db.instance;
    }
    connect(){
        return new Promise((resolve, reject)=>{
            if(!this.db){
                client.connect(err => {
                    if(err){
                        reject(err)
                    }else{
                        console.log("Connected server successfully to ");
                        this.db=client.db(dbName);
                        resolve(this.db)
                }
              });
            }
            else{
                resolve(this.db)
            }
        })
    }
    find(collectionName, json){
        return new Promise((resolve, reject)=>{
            this.connect().then(db=>{
                var result=db.collection(collectionName).find(json).sort({time: -1});
                result.toArray((err,docs)=>{
                    if (err) {
                        reject(err);
                        return;
                    }
                    else{
                        resolve(docs)
                    }
                })
            })
        })
    }
    findOne(collectionName, json){
        return new Promise((resolve, reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).findOne(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                });
            })
        })
    }
    updateOne(collectionName, con, json){
        return new Promise((resolve, reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).updateOne(con,{$set: json},(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                });
            })
        })
    }
    saveOne(collectionName, json){
        return new Promise((resolve, reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).insertOne(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                });
            })
        })
    }
    removeOne(collectionName, json){
        return new Promise((resolve, reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).deleteOne(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                });
            })
        })
    }
    removeMany(collectionName, json){
        return new Promise((resolve, reject)=>{
            this.connect().then(db=>{
                db.collection(collectionName).deleteMany(json,(err,result)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(result)
                    }
                });
            })
        })
    }
}

module.exports = Db.getInstance();


