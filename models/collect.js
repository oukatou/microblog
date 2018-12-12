const db = require('../models/db');
class Collect{
    constructor(user,collectable_id,collect_id){
        this.username = user;
        this.collectable_id = collectable_id;
        this.collect_id = collect_id;
    }
    save(){
        let collect = {
            collect_id: this.collect_id,
            user: this.username,
            collectable_id: this.collectable_id
        }
        return new Promise(async resolve=>{
            let result = await db.saveOne('collect',collect)
            resolve(result)
        })
    }
    static remove(id){
        return new Promise(async resolve=>{
            let info = {collect_id: Number(id)}
            let result = await db.removeOne('collect', info)
            resolve(result)
        })
    }
    static get(username){
        return new Promise(async resolve=>{
            let query = {};
            if(username){
                query.user = username
            }
            let result = await db.find('collect',query)
            resolve(result)
        })
    }
    static getOne(info){
        return new Promise(async resolve=>{
            let result = await db.findOne('collect',info)
            resolve(result)
        })
    }
    static findOne(id){
        return new Promise(async resolve=>{
            let info = {collect_id: Number(id)}
            let result = await db.findOne('collect',info)
            resolve(result)
        })
    }
}

module.exports = Collect