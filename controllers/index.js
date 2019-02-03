const Post = require('../models/post')
const Like = require('../models/like')
const Collect = require('../models/collect')
const User = require('../models/user')
const main = async ctx => {
    let posts = await Post.get();
    let currentUser
    let username = null
    let user_posts = []
    let layout = 'layout';
    let userinfo
    if (ctx.session.userinfo){
        currentUser  = ctx.session.userinfo;
        username = currentUser.username;
        user_posts = await Post.get(username);
        for(let i=0; i<posts.length; i++){
            let post = posts[i];
            let id = String(post._id);
            let like = await Like.getOne({likeable_id:id,user: username})
            let collect = await Collect.getOne({collectable_id:id,user: username})
            if(like){
                Object.assign(post,{like_id: like.like_id})
            }
            if(collect){
                Object.assign(post,{collect_id: collect.collect_id})
            }
        }
        userinfo = await User.get(currentUser.username)
    }
    for(let i=0; i<posts.length; i++){
        let post = posts[i];
        let user = await User.get(post.user)
        Object.assign(posts[i], {avatarUrl: user.avatarUrl})
    }
    if (/all/.test(ctx.path)){
        layout = false;
    }
    await ctx.render('index', {
        layout,
        posts,
        posts_count: user_posts.length,
        username,
        avatarUrl: userinfo ? userinfo.avatarUrl : ''
    })
}
module.exports = {
    'GET /': main,
    'GET /all': main
}