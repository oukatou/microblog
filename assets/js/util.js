
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
$(document).on('click','.not-liked',(e)=>{
    $link = $(e.currentTarget);
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
$(document).on('click','.liked',(e)=>{
    $link = $(e.currentTarget);
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
                    $link.parents('.deleted').slideUp('slow').queue(function() {
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

$(document).on('click','.not-collected',(e)=>{
    $link = $(e.currentTarget);
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
$(document).on('click','.collected',(e)=>{
    $link = $(e.currentTarget);
    e.preventDefault()
    $.ajax({
        url: '/not_collect',
        type: 'post',
        data: {collect_id: $link.data('collect-id')},
        success(result){
            if(result.success){
                $link.removeClass('collected glyphicon-star').addClass('not-collected glyphicon-star-empty')
                if('collected_count' in result){
                    $link.parents('.deleted').slideUp('slow').queue(function() {
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
    let target  = e.target;
    if($(target).hasClass('comment') || $(target).parents('.comment').length){
        let feed_box = $(this).find('.feed_box')
        if(feed_box.is(':visible')){
            feed_box.hide()
        }else{
            feed_box.show()
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