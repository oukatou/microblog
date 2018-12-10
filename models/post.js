const db = require('../models/db');
const mongoose = require('mongoose');
class Post {
    constructor(user, post, time) {
        this.user = user;
        this.post = post;
        this.time = time;
    }
    save() {
        let post = {
            user: this.user,
            post: this.post,
            liked: 0,
            time: this.time
        }
        return new Promise(async resolve => {
            let result = await db.saveOne('posts', post);
            resolve(result)
        })
    }
    static update(wb_id, post){
        return new Promise(async resolve =>{
            let result = await db.updateOne('posts',{'_id': mongoose.Types.ObjectId(wb_id)},post)
            resolve(result)
        })
    }
    static findOne(wb_id){
        let info = {
            _id: mongoose.Types.ObjectId(wb_id)
        }
        return new Promise(async resolve=>{
            let result = await db.findOne('posts', info)
            resolve(result)
        })
    }
    static remove(wb_id) {
        let info = {
            _id: mongoose.Types.ObjectId(wb_id)
        }
        return new Promise(async resolve => {
            let result = await db.removeOne('posts', info);
            resolve(result)
        })
    }
    static get(user) {
        let query = {};
        if(user){
            query.user = user
        }
        return new Promise(async resolve => {
            let posts = await db.find('posts', query);
            resolve(posts)
        })
    }
}

module.exports = Post