const ProfileUpdateInfo = () => {
    $(".profile-update-form").submit(function (event) {
        event.preventDefault();
        var form = $(this);
        var endPoint = form.attr("action");
        var method = form.attr("method");
        var formData = new FormData(this);
        console.log('endpoint: ', endPoint);
        console.log('form data:', formData);
        $.ajax({
            url: endPoint,
            method: method,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log("success");
                document.querySelector(".profile-update-modal").style.display = 'none';
            },
            error: function (error) {
                console.log("error", error)
            },
        })
    })
}

$(".profile-update-modal-redirect").on("click", function () {
    document.querySelector(".profile-update-modal").style.display = 'flex';
})
$(".profile-update-modal-close").on('click', function () {
    document.querySelector(".profile-update-modal").style.display = 'none';
})
ProfileUpdateInfo();
