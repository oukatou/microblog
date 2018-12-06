const Post = require('../models/post')
const post = async (ctx)=>{
    let currentUser  = ctx.session.userinfo;
    let content = ctx.request.body.post.replace(/\s+/g,'')
    if(!content){
        ctx.flash = { error: '内容不能为空' };
        return ctx.redirect('/user/' + currentUser.username)
    }
    let post = new Post(currentUser.username,ctx.request.body.post,new Date().Format("yyyy-MM-dd hh:mm:ss"));
    let result = await post.save()
    if(result.result.n == 1){
        ctx.flash = { success: '发布成功' };
        ctx.redirect('/user/' + currentUser.username)
    }
}
const remove = async (ctx)=>{
    let wid = ctx.request.body.id;
    let result = await Post.remove(wid)
    if(result.result.n == 1){
        ctx.body = {success: true,
                    wid: wid};
    }else{
        ctx.body = {success: false};
    }
}

module.exports={
    'POST /post': post,
    'DELETE /remove': remove
}