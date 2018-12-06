const logout = ctx=> {
    ctx.session.userinfo = null;
    ctx.flash = { success: '退出成功' };
    ctx.redirect('/')
}

module.exports = {
    "GET /logout": logout
}