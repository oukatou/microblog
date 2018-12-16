const Post = require('../models/post')
const Like = require('../models/like')
const Collect = require('../models/collect')
const main = async ctx => {
    let posts = await Post.get();
    let currentUser
    let username = null
    let user_posts = []
    let layout = 'layout';
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
                Object.assign(posts[i],{like_id: like.like_id})
            }
            if(collect){
                Object.assign(posts[i],{collect_id: collect.collect_id})
            }
        }
    }if (/all/.test(ctx.path)){
        layout = false;
    }
    await ctx.render('index', {
        layout,
        posts,
        posts_count: user_posts.length,
        username
    })
}
module.exports = {
    'GET /': main,
    'GET /all': main
}