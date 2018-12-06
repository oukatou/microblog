const db = require('../models/db')
class User{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }
    static get(username){
        return new Promise(async (resolve,reject)=>{
            let user =await db.findOne('user',{username: username})
            resolve(user)
        })
    }
    save(){
        return new Promise(async (resolve,reject)=>{
            let result =await db.saveOne('user', {username : this.username, password: this.password});
            resolve(result)
        })
    }
}
module.exports = User