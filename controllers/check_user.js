const checkNotLogin = async (ctx,next)=>{
    if(ctx.session.userinfo){
        ctx.redirect('/')
    }
    else{
        await next()
    }
}
const checkLogin = async (ctx,next)=>{
    if(!ctx.session.userinfo){
        ctx.redirect('/login')
    }
    else{
        await next()
    }
}

module.exports = {
    'GET /login': checkNotLogin,
    "GET /reg": checkNotLogin,
    "GET /logout": checkLogin,
    'GET /edit': checkLogin

}