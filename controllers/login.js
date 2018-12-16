const User = require('../models/user')
const login = async ctx =>{
    await ctx.render('login', {
        layout: 'header'
    });
}
const dologin = async ctx => {
    let name = ctx.request.body.username;
    let pwd = ctx.request.body.password;
    let user = await User.get(name);
    if(!user){
        ctx.flash = { error: '用户名不存在，请重新输入' };
        return ctx.redirect('login')
    }
    else{
        if(user.password == pwd){
            ctx.session.userinfo = user;
            ctx.flash = { success: '登入成功' };
            ctx.redirect('/user/'+user.username)
        }
        else{
            ctx.flash = { error: '密码错误' };
            return ctx.redirect('login')
        }
    }
}
module.exports = {
    'GET /login': login,
    'POST /login': dologin
}