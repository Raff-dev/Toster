
$(".login-redirect").on("click", function () {
    document.querySelector(".login-modal").style.display = 'flex';

})
$(".login-modal-close").on('click', function () {
    document.querySelector(".login-modal").style.display = 'none';
})