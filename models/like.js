const db = require('../models/db');
class Like{
    constructor(user,likeable_id,like_id){
        this.username = user;
        this.likeable_id = likeable_id;
        this.like_id = like_id;
    }
    save(){
        let like = {
            like_id: this.like_id,
            user: this.username,
            likeable_id: this.likeable_id
        }
        return new Promise(async resolve=>{
            let result = await db.saveOne('like',like)
            resolve(result)
        })
    }
    static remove(id){
        return new Promise(async resolve=>{
            let info = {like_id: Number(id)}
            let result = await db.removeOne('like', info)
            resolve(result)
        })
    }
    static get(){
        return new Promise(async resolve=>{
            let result = await db.find('like',{})
            resolve(result)
        })
    }
    static getOne(info){
        return new Promise(async resolve=>{
            let result = await db.findOne('like',info)
            resolve(result)
        })
    }
}

module.exports = Like