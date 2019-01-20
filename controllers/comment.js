const Comment = require('../models/comment')
const Post = require('../models/post')

const post = async (ctx) => {
    let commentable_id = ctx.request.body.commentable_id;
    let content = ctx.request.body.content;
    let post = await Post.findOne(commentable_id)
    let commented = post.commented
    commented++
    let result = await Post.update(commentable_id,{commented})
    let comment_id=0;
    let comments = await Comment.get()
    for(let i = 0; i< comments.length; i++){
        let id = comments[i].comment_id;
        if(id>comment_id){
            comment_id = id
        }
    }
    comment_id++
    let currentUser  = ctx.session.userinfo;
    let time = new Date().Format("yyyy-MM-dd hh:mm:ss");
    let comment = new Comment(currentUser.username,commentable_id,comment_id,content,time)
    let commented_result = await comment.save()
    if (commented_result.result.n == 1 && result.result.n == 1){
        ctx.body =  {success: true,
                     commented,
                     comment_id,
                     time}
    }else{
        ctx.body = {success: false};
        return;
    }
}
const comments = async (ctx)=>{
    let commentable_id = ctx.query.commentable_id;
    let comments = await Comment.get(commentable_id)
    ctx.body = {
        comments
    }
}
const remove = async (ctx)=>{
    let comment_id = ctx.request.body.comment_id;
    let commentable_id = ctx.request.body.commentable_id;
    let delete_result = await Comment.remove({comment_id})
    let post = await Post.findOne(commentable_id)
    let commented = post.commented
    commented--
    let result = await Post.update(commentable_id,{commented})
    if(delete_result.result.n == 1 && result.result.n == 1){
        ctx.body = {
            success: true,
            commented
        }
    }

}
module.exports = {
    'POST /comment': post,
    'GET /comments': comments,
    'DELETE /comments': remove,
}