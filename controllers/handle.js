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
    }else{
        ctx.flash = { error: '未知错误，请重新发布' };
        ctx.redirect('/user/' + currentUser.username)
    }
}
const edit = async (ctx)=>{
    let id = ctx.request.query.id
    if (id.length == 24){
        let result = await Post.findOne(id)
        if(result){
            await ctx.render('edit',{
                content: result.post,
                id: id
            })
        }else{
            return ctx.redirect('/')
        }
    }else{
        return ctx.redirect('/')
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
    if (id.length != 24){
        return ctx.redirect('/')
    }
    let post = await Post.findOne(id)
    if(post && post.user != currentUser.username){
        return ctx.redirect('/')
    }
    let postContent = ctx.request.body.post
    console.log(postContent)
    let time = new Date().Format("yyyy-MM-dd hh:mm:ss");
    let result = await Post.update(id,{post: postContent,time})
    if(result.result.n == 1){
        ctx.flash = { success: '更新成功' };
        ctx.redirect('/user/' + currentUser.username)
    }else{
        ctx.flash = { error: '未知错误，请重新编辑' };
        return ctx.redirect('/edit?id=' + id)
    }
}
const remove = async (ctx)=>{
    let currentUser  = ctx.session.userinfo;
    let id = ctx.request.body.id;
    if (id.length != 24){
        ctx.body = {success: false};
        return
    }
    let post = await Post.findOne(id)
    if(post && post.username != currentUser.username){
        ctx.body = {success: false};
        return
    }
    let result = await Post.remove(id)
    if(result.result.n == 1){
        ctx.body = {success: true,
                    wid: id};
    }else{
        ctx.body = {success: false};
        return
    }
}

module.exports={
    'POST /post': post,
    'DELETE /remove': remove,
    'POST /edit': doedit,
    'GET /edit': edit
}