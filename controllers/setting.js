const User = require('../models/user')
const fs = require('fs')
const path = require('path')
const profile = async ctx =>{
    let userinfo = await User.get(ctx.session.userinfo.username)
    let avatarUrl = userinfo.avatarUrl
    await ctx.render('profile', {
        layout: 'setting',
        avatarUrl
    });
}
const avatar = async ctx =>{
    let userinfo = await User.get(ctx.session.userinfo.username)
    let avatarUrl = userinfo.avatarUrl
    await ctx.render('avatar', {
        layout: 'setting',
        avatarUrl
    });
}
const password = async ctx =>{
    let userinfo = await User.get(ctx.session.userinfo.username)
    let avatarUrl = userinfo.avatarUrl
    await ctx.render('password', {
        layout: 'setting',
        avatarUrl
    });
}
const close = async ctx =>{
    let userinfo = await User.get(ctx.session.userinfo.username)
    let avatarUrl = userinfo.avatarUrl
    await ctx.render('close', {
        layout: 'setting',
        avatarUrl
    });
}
const uploadAvatar = async ctx =>{
    let file = ctx.request.files.file;
    let reader = fs.createReadStream(file.path);
    let ext = file.name.split('.').pop();
    let name = file.name.split('.').shift()
    let filename = `${name}${Math.floor(Math.random()*10e9)}.${ext}`
    let upStream = fs.createWriteStream(path.join(__dirname,'../assets/upload/') + filename)
    reader.pipe(upStream);
    ctx.body={
        success: true,
        text: 'upload success',
        filename
    }
    return
}
const avatarSave = async ctx=>{
    let currentUsername  = ctx.session.userinfo.username;
    let avatarName = ctx.request.body.avatarName
    let avatarUrl =  '/upload/'+ avatarName;
    User.update(currentUsername,{avatarUrl})
    await ctx.redirect('avatar', {
        layout: 'setting',
        avatarUrl
    });

}
module.exports = {
    'GET /profile': profile,
    'GET /avatar': avatar,
    'GET /password': password,
    'GET /close': close,
    'POST /avatarSave': avatarSave,
    'POST /avatar': uploadAvatar
}