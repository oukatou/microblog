const db = require('../models/db');
class Comment{
    constructor(user,commentable_id,comment_id,content,time){
        this.username = user;
        this.commentable_id = commentable_id;
        this.comment_id = comment_id;
        this.content = content;
        this.time = time
    }
    save(){
        let comment = {
            comment_id: this.comment_id,
            content: this.content,
            user: this.username,
            commentable_id: this.commentable_id,
            time: this.time
        }
        return new Promise(async resolve=>{
            let result = await db.saveOne('comment',comment)
            resolve(result)
        })
    }
    static remove({comment_id,commentable_id}){
        return new Promise(async resolve=>{
            let result
            if(comment_id){
                let info = {comment_id: Number(comment_id)}
                result = await db.removeOne('comment', info)
            }else if(commentable_id){
                let info = {commentable_id}
                result = await db.removeMany('comment', info)
            }
            resolve(result)
        })
    }
    static get(commentable_id){
        return new Promise(async resolve=>{
            let query = {}
            if(commentable_id){
                query.commentable_id = commentable_id
            }
            let result = await db.find('comment',query)
            resolve(result)
        })
    }
}

module.exports = Comment