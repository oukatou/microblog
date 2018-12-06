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
            time: this.time
        }
        return new Promise(async reslove => {
            let result = await db.saveOne('posts', post);
            reslove(result)
        })
    }
    static remove(wb_id) {
        let info = {
            _id: mongoose.Types.ObjectId(wb_id)
        }
        return new Promise(async reslove => {
            let result = await db.removeOne('posts', info);
            reslove(result)
        })
    }
    static get(user) {
        let query = {};
        if(user){
            query.user = user
        }
        return new Promise(async reslove => {
            let posts = await db.find('posts', query);
            reslove(posts)
        })
    }
}

module.exports = Post