$('.nav-left a').hover(function () {
    var div = $(this).find('div')
    var img = $(this).find('img').get(1)

    div.css({ 'background-color': 'rgba(85, 172, 238, 0.15)' });
    $(this).find('p').css('color', 'rgba(23, 139, 228, 1)');
    $(this).css('opacity', '1')

    if (Array.from(div.get(0).classList).includes('profile'))
        $(img).css('border', '3px solid rgba(23, 139, 228, 1)')
    else $(img).css('opacity', '1')
}, function () {
    // on mouseout, reset the background colour
    var div = $(this).find('div')
    var img = $(this).find('img').get(1)
    $(this).css('background-color', 'white');
    $(this).find(' p').css('color', 'black');
    div.css({ 'background-color': 'white' });

    if (Array.from(div.get(0).classList).includes('profile')) {
        $(img).css('border', '0px solid')
    }
    else $(img).css('opacity', '0')

});






