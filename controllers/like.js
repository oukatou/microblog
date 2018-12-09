let Like = require('../models/like')
const like = async (ctx)=>{
    let likeable_id = ctx.request.body.likeable_id;
    let currentUser  = ctx.session.userinfo;
    let like_id=0;
    let likes = await Like.get()
    for(let i = 0; i< likes.length; i++){
        let id = likes[i].like_id;
        if(id>like_id){
            like_id = id
        }
    }
    like_id++
    let like = new Like(currentUser.username,likeable_id,like_id,)
    let result = await like.save()
    if (result.result.n == 1){
        ctx.body =  {success: true,
                     like_id: like_id}
    }

}
const not_like = async (ctx)=>{
    let like_id = ctx.request.body.like_id;
    let result = await Like.remove(like_id)
    if (result.result.n == 1){
        ctx.body = {
            success: true
        }
    }
}
module.exports={
    'POST /like': like,
    'POST /not_like': not_like
}