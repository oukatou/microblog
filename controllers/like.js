const Like = require('../models/like')
const Post = require('../models/post')
const User = require('../models/user')
const Collect = require('../models/collect')
const likes = async (ctx)=>{
    let username = ctx.params.username;
    let currentUser  = ctx.session.userinfo;
    let user = await User.get(username);
    let layout = 'layout';
    if(!user){
        ctx.flash={ error: '用户不存在' };
        return ctx.redirect('/')
    }
    let likes = await Like.get(username)
    let liked_posts = []
    for(let i = 0; i< likes.length; i++){
        let id = likes[i].likeable_id
        let post = await Post.findOne(id)
        if(currentUser && post){
            let user = await User.get(post.user)
            Object.assign(post, {avatarUrl: user.avatarUrl})
            let collect = await Collect.getOne({collectable_id:id,user: currentUser.username})
            let like = await Like.getOne({likeable_id:id,user: currentUser.username})
            if(collect){
                Object.assign(post,{collect_id: collect.collect_id})
            }
            if(like){
                Object.assign(post,{like_id: like.like_id})
            } 
        }else if(post){
            let user = await User.get(post.user)
            Object.assign(post, {avatarUrl: user.avatarUrl})
        }else if(!post){
            post = likes[i]
            Object.assign(post,{username, username})
        }
        liked_posts.unshift(post)
    }
    if (/get_like/.test(ctx.path)){
        layout = false;
    }
    let myPosts = await Post.get(username);
    await ctx.render('like_frame',{
        layout,
        posts: liked_posts,
        posts_count: myPosts.length,
        username,
        avatarUrl: user.avatarUrl
    })
}
const like = async (ctx)=>{
    let likeable_id = ctx.request.body.likeable_id;
    let liked
    if (likeable_id.length == 24){
        let post = await Post.findOne(likeable_id)
        if(post){
            liked = post.liked
            liked++
        }else{
            ctx.body = {success: false};
            return
        }
    }else{
        ctx.body = {success: false};
        return
    }
    let currentUser  = ctx.session.userinfo;
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
    }else{
        ctx.body = {success: false};
        return;
    }

}
const not_like = async (ctx)=>{
    let like_id = ctx.request.body.like_id;
    let likeable_id = ctx.request.body.likeable_id;
    let username = ctx.request.body.username;
    let liked, not_liked_result, result, post
    let likes = 0;
    if(username){
        likes = await Like.get(username)
    }
    if (likeable_id.length == 24){
        post = await Post.findOne(likeable_id)
        let liked_post = await Like.findOne(like_id)
        if (!post && liked_post){
            not_liked_result = await Like.remove(like_id)
            if(not_liked_result.result.n == 1){
                ctx.body = {
                    success: true,
                    liked_count: likes.length-1
                }
                return;
            }
        }
        if(post && liked_post){
            liked = post.liked
            liked--
            result = await Post.update(likeable_id,{liked})
            not_liked_result = await Like.remove(like_id)
        }else{
            return ctx.status = 500;
        }
    }else{
        ctx.body = {success: false};
        return;
    }
    if (post && result.result.n == 1 && not_liked_result.result.n == 1){
        ctx.body = {
            success: true,
            liked
        }
    } else {
        ctx.body = {success: false};
        return;
    }
}
module.exports={
    'GET /get_like/:username': likes,
    'GET /like/:username': likes,
    'POST /like': like,
    'POST /not_like': not_like
}