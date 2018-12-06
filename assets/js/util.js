
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