const User = require('../models/user')
const Post = require('../models/post')
const Like = require('../models/like')
const userposts = async (ctx)=>{
    let username = ctx.params.username
    let currentUser  = ctx.session.userinfo;
    let user = await User.get(username)
    if(!user){
        ctx.flash={ error: '用户不存在' };
        return ctx.redirect('/')
    }
    let posts = await Post.get(username);
    for(let i=0; i<posts.length; i++){
        let post = posts[i];
        let id = String(post._id);
        let like = await Like.getOne({likeable_id:id,user: currentUser.username})
        if(like){
            Object.assign(posts[i],{like_id: like.like_id})
        }
    }
    await ctx.render('user_frame',{
        posts: posts,
        username: username
    })
}

module.exports = {
    'GET /user/:username': userposts
}