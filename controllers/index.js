const Post = require('../models/post')
const main = async ctx => {
    let posts = await Post.get();
    await ctx.render('index', {
        posts
    })
}
module.exports = {
    'GET /': main
}