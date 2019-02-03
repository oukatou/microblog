const User = require('../models/user')
const Post = require('../models/post')
const Like = require('../models/like')
const Collect = require('../models/collect')
const userposts = async (ctx)=>{
    let username = ctx.params.username
    let user = await User.get(username)
    let layout = 'layout'
    if(!user){
        ctx.flash={ error: '用户不存在' };
        return ctx.redirect('/')
    }
    let posts = await Post.get(username);
    if(ctx.session.userinfo){
        let currentUser  = ctx.session.userinfo;
        for(let i=0; i<posts.length; i++){
            let post = posts[i];
            let id = String(post._id);
            let like = await Like.getOne({likeable_id:id,user: currentUser.username})
            if(like){
                Object.assign(post,{like_id: like.like_id})
            }
            if(currentUser){
                let collect = await Collect.getOne({collectable_id:id,user: currentUser.username})
                if(collect){
                    Object.assign(post,{collect_id: collect.collect_id})
                }
            }
        }
    }
    for(let i=0; i<posts.length; i++){
        Object.assign(posts[i], {avatarUrl: user.avatarUrl})
    }
    if(/get_user/.test(ctx.path)){
        layout = false;
    }
    await ctx.render('user_frame',{
        layout,
        posts,
        posts_count: posts.length,
        username,
        avatarUrl: user.avatarUrl
    })
}

module.exports = {
    'GET /user/:username': userposts,
    'GET /get_user/:username': userposts
}