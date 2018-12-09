const Post = require('../models/post')
const post = async (ctx)=>{
    let currentUser  = ctx.session.userinfo;
    let cont = ctx.request.body.post.replace(/\s+/g,'')
    if(!cont){
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
const edit = async (ctx)=>{
    let id = ctx.request.query.id
    let result = await Post.findOne(id)
    if(result){
        await ctx.render('edit',{
            content: result.post,
            id: id
        })
    }
}
const doedit = async (ctx)=>{
    let currentUser  = ctx.session.userinfo;
    let cont = ctx.request.body.post.replace(/\s+/g,'')
    let id = ctx.request.body.wb_id
    if(!cont){
        ctx.flash = { error: '内容不能为空' };
        return ctx.redirect('/edit?id=' + id)
    }
    let post = ctx.request.body.post
    let time = new Date().Format("yyyy-MM-dd hh:mm:ss");
    let result = await Post.update(id,{post,time})
    if(result.result.n == 1){
        ctx.flash = { success: '更新成功' };
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
    'DELETE /remove': remove,
    'POST /edit': doedit,
    'GET /edit': edit
}