
$('.leftnav li').click(function(){
    $(this).addClass('active').siblings().removeClass('active')
})
$('#post').click(function(){
    $(this).parent('.input').addClass('clicked')
})
$('#post').blur(function(){
    $(this).parent('.input').removeClass('clicked')
})
$('.delete-link').click(function(){
    $.ajax({
        url: '/remove',
        method: 'delete',
        data: {id: $(this).attr('wb-id')},
        success(result){
            if(result.success){
                $('[wid=' + result.wid + ']').fadeOut('fast').queue(function() {
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
               likeable_id: $link.data('likeable-id')},
        success(result){
            if(result.success){
                $link.removeClass('liked glyphicon-heart').addClass('not-liked glyphicon-heart-empty')
                if(result.liked)
                    $link.find('span').text(' '+ result.liked)
                else
                    $link.find('span').text(' 赞')
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
            }
        }
    })
})
$(document).on('click','.cardwrap',function(e){
    let target  = e.target;
    if($(target).hasClass('comment')){
        let feed_box = $(this).find('.feed_box')
        if(feed_box.is(':visible')){
            feed_box.hide()
        }else{
            feed_box.show()
        }
    }
})