
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
        data: {like_id: $link.data('like-id')},
        success(result){
            if(result.success){
                $link.removeClass('liked glyphicon-heart').addClass('not-liked glyphicon-heart-empty')
            }
        }
    })
})