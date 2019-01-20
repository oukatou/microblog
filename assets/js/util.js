var app = new Vue({
    el: '#app',
    data: {
        currentPath: window.location.pathname
    },
    computed:{
        isUserpage(){
            return /user/.test(this.currentPath)
        },
        isCollectpage(){
            return /collect/.test(this.currentPath)
        },
        isLikepage(){
            return /like/.test(this.currentPath)
        },
        isHomepage(){
            return /\//.test(this.currentPath)
        }
    }
  })
$(document).ready(function(){
$('.leftnav li').click(function(){
    $(this).addClass('active').siblings().removeClass('active')
})
$(document).on('click', '#post', function(){
    $(this).parent('.input').addClass('clicked')
})
$(document).on('blur', '#post', function(){
    $(this).parent('.input').removeClass('clicked')
})
$(document).on('click','.delete-link',function(){
    $.ajax({
        url: '/remove',
        method: 'delete',
        data: {id: $(this).attr('wb-id')},
        success(result){
            if(result.success){
                $('[wid=' + result.wid + ']').slideUp('normal').queue(function() {
                    $(this).remove();
                })
                let count = Number($('.count').text())
                $('.count').text(--count)
            }
        }
    })
})
$(document).on('click','.not-liked',function(e){
    let $link = $(e.currentTarget);
    e.preventDefault()
    $.ajax({
        url: '/like',
        type: 'post',
        data: {likeable_id: $link.data('likeable-id')},
        success(result){
            if(result.success){
                $link.removeClass('not-liked glyphicon-heart-empty').addClass('liked glyphicon-heart')
                $link.data('likeId',result.like_id)
                $link.find('span').text(' '+ result.liked)
            }
        }
    })
})
$(document).on('click','.liked',function(e){
    let $link = $(e.currentTarget);
    e.preventDefault()
    $.ajax({
        url: '/not_like',
        type: 'post',
        data: {like_id: $link.data('like-id'),
               likeable_id: $link.data('likeable-id'),
               username: $link.data('username')},
        success(result){
            if(result.success){
                if('liked' in result){
                    $link.removeClass('liked glyphicon-heart').addClass('not-liked glyphicon-heart-empty')
                    if(result.liked != 0){
                        $link.find('span').text(' '+ result.liked)
                    }else{
                        $link.find('span').text(' 赞')
                    }
                }else if('liked_count' in result){
                    $link.parents('.cardwrap').slideUp('slow').queue(function() {
                        $(this).remove();
                        if(result.liked_count == 0){
                            $('.middle').html('还没有赞')
                        }
                    })
                }
            }
        }
    })
})

$(document).on('click','.not-collected',function(e){
    let $link = $(e.currentTarget);
    e.preventDefault()
    $.ajax({
        url: '/collect',
        type: 'post',
        data: {collectable_id: $link.data('collectable-id')},
        success(result){
            if(result.success){
                $link.removeClass('not-collected glyphicon-star-empty').addClass('collected glyphicon-star')
                $link.data('collectId',result.collect_id)
            }
        }
    })
})
$(document).on('click','.collected',function(e){
    let $link = $(e.currentTarget);
    e.preventDefault()
    $.ajax({
        url: '/not_collect',
        type: 'post',
        data: {collect_id: $link.data('collect-id')},
        success(result){
            if(result.success){
                $link.removeClass('collected glyphicon-star').addClass('not-collected glyphicon-star-empty')
                if('collected_count' in result){
                    $link.parents('.cardwrap').slideUp('slow').queue(function() {
                        $(this).remove();
                        if(result.collected_count == 0){
                            $('.middle').html('还没有收藏')
                        }
                    })
                }
            }
        }
    })
})
$(document).on('click','.cardwrap',function(e){
    let target = e.target;
    if($(target).hasClass('comment') || $(target).parents('.comment').length){
        let feed_box = $(this).find('.feed_box')
        let feed_list = feed_box.find('.feed_list')
        if(feed_box.is(':visible')){
            feed_box.hide()
            feed_list.empty()
        }else{
            feed_box.show()
            $.ajax({
                url: '/comments',
                type: 'get',
                data: {commentable_id: $(this).attr('wid')},
                success(resp){
                    if(resp.comments.length>0){
                        resp.comments.forEach((item)=>{
                            feed_list.append($(createComment(
                                {user:item.user,content:item.content,time:item.time,comment_id:item.comment_id})).hide().fadeIn())
                        })
                    }
                }
            })
            feed_box.find('textarea').focus()
        }
    }
})
$(document).on('click','#collect',function(e){
    e.preventDefault()
    $.ajax({
        url: '/get_collect',
        type: 'get',
        success(dom){
            $('.container .middle').html(dom);
            history.pushState('','','/collect')
        }
    })
})
$(document).on('click','#like',function(e){
    e.preventDefault()
    let url = $(this).find('a').attr('href')
    $.ajax({
        url,
        type: 'get',
        success(dom){
            $('.container .middle').html(dom);
            history.pushState('','','/like/'+url.split('/')[2])
        }
    })
})
$(document).on('click','#home',function(e){
    e.preventDefault()
    let url = $(this).find('a').attr('href')
    let user = url.split('/')[1]
    if(user != 'all'){
        url = '/get_user/'+url.split('/')[2]
        $.ajax({
            url,
            type: 'get',
            success(dom){
                $('.container .middle').html(dom);
                history.pushState('','','/user/'+url.split('/')[2])
            }
        })
    }else{
        url = '/all'
        $.ajax({
            url,
            type: 'get',
            success(dom){
                $('.container .middle').html(dom);
                history.pushState('','','/')
            }
        })
    }
})
})

$(document).on('click','.add-comment',function(e){
    let $link = $(e.currentTarget);
    let $textarea = $link.closest('.input').find('textarea');
    let $feed_box = $link.closest('.feed_box')
    let content = $textarea.val();
    if(!content.trim()){
        alert('内容不能为空')
        return
    }
    let user = window.CURRENT_USER.username;
    $textarea.val('')
    $.ajax({
        url: '/comment',
        type: 'post',
        data: {commentable_id: $link.closest('.cardwrap').attr('wid'),
               content },
        success(result){
            let time = result.time;
            let comment_id = result.comment_id
            if(result.success){
                $feed_box.find('.feed_list').prepend($(createComment({ user,content,time,comment_id}))).hide().fadeIn()
                $feed_box.siblings('.handle').find('.comment span').text(' '+ result.commented)
            }
        }
    })
})
$(document).on('click','.delete-comment',function(e){
    e.preventDefault();
    let $feed_item = $(this).closest('.feed_item')
    let id = $feed_item.data('comment-id')
    $.ajax({
        url: '/comments',
        type: 'delete',
        data: {comment_id: id,
               commentable_id: $(this).closest('.cardwrap').attr('wid')},
        success(resp){
            if(resp.success === true){
                $feed_item.slideUp('fast').queue(function() {
                    if(resp.commented != 0){
                        $(this).closest('.feed_box').siblings('.handle').find('.comment span').text(' '+ resp.commented)
                    }else{
                        $(this).closest('.feed_box').siblings('.handle').find('.comment span').text(' 评论')
                    }   
                    $(this).remove();
                })
            }
        }
    })
})
const createComment = ({user,content,time,comment_id})=>{
    let current_user = window.CURRENT_USER ? window.CURRENT_USER.username : ''
    return [
        '<div class="feed_item" data-comment-id=', comment_id ,'>',
        '<a class="name" target="_blank" href="/user/', user,'">', user ,':</a>',
        '<span class="content" >', content, '</span>',
        '<div><span class="time">', time,
        (user == current_user) ? '</span> <a class="delete-comment" href="#">删除</a></div>' : '',
        '</div>'].join('')
}