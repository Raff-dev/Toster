
$('.nav-left a').each((index, elem) => {
    if (window.location.pathname == $(elem).attr('href')) {
        if ($(elem).find('.profile').length) {
            $(elem).find('profile').css('border', '1px solid rgba(23, 139, 228, 1)')
            $(elem).find('img').css('border', '2px solid rgba(23, 139, 228, 1)')
        } else {
            $(elem).find('.filled').css('opacity', '1')
            $(elem).find('.black').css('visibility', 'hidden')
        }
        $(elem).find('p').css('color', 'rgba(23, 139, 228, 1)');
    }
})




