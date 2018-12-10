let Like = require('../models/like')
let Post = require('../models/post')
const likes = async (ctx)=>{
    let username = ctx.params.username;
    let likes = await Like.get(username)
    let liked_posts = []
    for(let i = 0; i< likes.length; i++){
        let id = likes[i].likeable_id
        let post = await Post.findOne(id)
        if(post){
            Object.assign(post,{like_id:likes[i].like_id})
            liked_posts.unshift(post)
        }
    }
    let posts = await Post.get(username);
    await ctx.render('like_frame',{
        posts: liked_posts,
        posts_count: posts.length,
        username: username
    })
}
const like = async (ctx)=>{
    let likeable_id = ctx.request.body.likeable_id;
    let currentUser  = ctx.session.userinfo;
    let post = await Post.findOne(likeable_id)
    let liked = post.liked
    liked++
    let result = await Post.update(likeable_id,{liked})
    let like_id=0;
    let likes = await Like.get()
    for(let i = 0; i< likes.length; i++){
        let id = likes[i].like_id;
        if(id>like_id){
            like_id = id
        }
    }
    like_id++
    let like = new Like(currentUser.username,likeable_id,like_id)
    let liked_result = await like.save()
    if (liked_result.result.n == 1 && result.result.n == 1){
        ctx.body =  {success: true,
                     liked,
                     like_id}
    }

}
const not_like = async (ctx)=>{
    let like_id = ctx.request.body.like_id;
    let likeable_id = ctx.request.body.likeable_id
    let post = await Post.findOne(likeable_id)
    let liked = post.liked
    liked--
    let result = await Post.update(likeable_id,{liked})
    let not_liked_result = await Like.remove(like_id)
    if (result.result.n == 1 && not_liked_result.result.n == 1){
        ctx.body = {
            success: true,
            liked
        }
    }
}
module.exports={
    'GET /like/:username': likes,
    'POST /like': like,
    'POST /not_like': not_like
}