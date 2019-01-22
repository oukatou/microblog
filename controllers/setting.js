const User = require('../models/user')
const setting = async ctx =>{
    await ctx.render('setting', {
        layout: 'header'
    });
}
const profile = async ctx =>{
    await ctx.render('profile', {
        layout: false
    });
}
const avatar = async ctx =>{
    await ctx.render('avatar', {
        layout: false
    });
}
const password = async ctx =>{
    await ctx.render('password', {
        layout: false
    });
}
const close = async ctx =>{
    await ctx.render('close', {
        layout: false
    });
}

module.exports = {
    'GET /setting': setting,
    'GET /profile': profile,
    'GET /avatar': avatar,
    'GET /password': password,
    'GET /close': close
}