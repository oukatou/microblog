const User = require('../models/user')
const register = async ctx=>{
   await ctx.render('reg',{
    layout: 'header'
})
}
const doregister = async ctx=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let re_password = ctx.request.body['password-repeat'];
    if (password != re_password){
        ctx.flash = { error: '两次输入的密码不一致' };
        return ctx.redirect('/reg')
    }
    let newUser = new User(username,password)
    let user = await User.get(username);
    if(user){
        ctx.flash = { error: '用户名已经存在，请重新输入' };
        return ctx.redirect('/reg')
    }
    else{
        let result = await newUser.save();
        if(result.result.n == 1){
            ctx.flash = { success: '注册成功，请登录' };
            ctx.redirect('/login')
        }
            
    }
}
module.exports = {
    "GET /reg": register,
    "POST /reg": doregister
}