const User = require('../models/user')
const Post = require('../models/post')
const userposts = async (ctx)=>{
    let username = ctx.params.username
    let user = await User.get(username)
    if(!user){
        ctx.flash={ error: '用户不存在' };
        return ctx.redirect('/')
    }
    let posts = await Post.get(username);
    await ctx.render('user_frame',{
        posts: posts,
        username: username
    })
}

module.exports = {
    'GET /user/:username': userposts
}