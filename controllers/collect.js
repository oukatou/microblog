const Collect = require('../models/collect')
const Post = require('../models/post')
const Like = require('../models/like')
const collections = async (ctx)=>{
    let currentUser  = ctx.session.userinfo;
    let username = currentUser.username;
    let collections = await Collect.get(username)
    let collected_posts = []
    let layout = 'layout';
    for(let i = 0; i< collections.length; i++){
        let id = collections[i].collectable_id
        let post = await Post.findOne(id)
        let like = await Like.getOne({likeable_id:id,user: currentUser.username})
        if (post){
            Object.assign(post,{collect_id:collections[i].collect_id})
            if(like){
                Object.assign(post,{like_id: like.like_id})
            }
        }else{
            post = collections[i]
        }
        collected_posts.unshift(post)
    }
    if (/get_collect/.test(ctx.path)){
        layout = false;
    }
    let myPosts = await Post.get(username);
    await ctx.render('collect_frame',{
        layout,
        posts: collected_posts,
        posts_count: myPosts.length,
        username
    })
}
const collect = async (ctx)=>{
    let collectable_id = ctx.request.body.collectable_id;
    let currentUser  = ctx.session.userinfo;
    let collect_id=0;
    let collect
    if (collectable_id.length == 24){
        let post = await Post.findOne(collectable_id)
        if(post){
            let collections = await Collect.get()
            for(let i = 0; i< collections.length; i++){
                let id = collections[i].collect_id;
                if(id > collect_id){
                    collect_id = id
                }
            }
            collect_id++
            collect = new Collect(currentUser.username, collectable_id, collect_id)
        }else{
            ctx.body = {success: false};
            return
        }
    }else{
        ctx.body = {success: false};
        return;
    }
    let collected_result = await collect.save()
    if (collected_result.result.n == 1){
        ctx.body = {success: true,
                     collect_id}
    }else{
        ctx.body = {success: false};
        return;
    }
}
const not_collect = async (ctx)=>{
    let collect_id = ctx.request.body.collect_id;
    let not_collected_result
    let post = await Collect.findOne(collect_id)
    let collections = 0;
    let currentUser  = ctx.session.userinfo;
    collections = await Collect.get(currentUser.username)
    if(post){
        not_collected_result = await Collect.remove(collect_id)
    }else{
        ctx.body = {success: false};
        return;
    }
    if (not_collected_result.result.n == 1){
        ctx.body = {
            success: true,
            collected_count: collections.length-1
        }
    }else{
        ctx.body = {success: false};
        return;
    }
}

module.exports={
    'GET /collect': collections,
    'GET /get_collect': collections,
    'POST /collect': collect,
    'POST /not_collect': not_collect
}