const Post = require('../models/post')
const Like = require('../models/like')
const main = async ctx => {
    let posts = await Post.get();
    if (ctx.session.userinfo){
        let currentUser  = ctx.session.userinfo;
        for(let i=0; i<posts.length; i++){
            let post = posts[i];
            let id = String(post._id);
            let like = await Like.getOne({likeable_id:id,user: currentUser.username})
            if(like){
                Object.assign(posts[i],{like_id: like.like_id})
            }
        }
    }
    await ctx.render('index', {
        posts
    })
}
module.exports = {
    'GET /': main
}