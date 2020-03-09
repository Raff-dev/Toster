function togglePublishButton() {
    document.getElementById('create').disabled = true;
    var input = document.getElementById("create-input")
    input.onblur = fun
    input.onfocus = fun
    input.onkeyup = fun
    function fun() {
        var button = document.getElementById('create')
        if (input.value === "") button.disabled = true;
        else button.disabled = false;
    }
}
function addImage() {
    $('#post-img-input').on("change", function () {
        console.log(this.files);
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = event => {
                var div = $(document.createElement('div'))
                var close = $(document.createElement('div'))
                var picture = "<img src='" + event.target.result + "' class='input-image'>"
                div.addClass('post-image')
                close.addClass('delete-image')
                close.append("<div class='x1'></div><div class='x2'></div>")
                div.append(picture, close)
                $(".post-images").append(div);
                close.click(function () {
                    close.parent().remove()
                })
            }
            reader.readAsDataURL(this.files[0]);
        }
        var close = document.getElementsByClassName("delete-image")
        console.log(close)
    });
}

togglePublishButton()
addImage()
