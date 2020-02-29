const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].style.animation = "navLinksFade 1s ease forwards " + 0.2 * i / navLinks.length + "s";
        }
    });
}

const deleteButton = () => {
    $(".delete-button-ajax").on("click", function (event) {
        event.preventDefault();

        if (window.confirm("Are you sure you want to delete this post?")) {
            var thisForm = $(this);
            var actionEndpoint = thisForm.attr("action");
            var httpMethod = thisForm.attr("method");
            var id = thisForm.attr("id");
            var formData = thisForm.serialize();
            console.log(id);
            $.ajax({
                url: actionEndpoint,
                method: httpMethod,
                data: formData,
                success: function (data) {
                    var post = document.getElementById("post-" + id);
                    console.log(id);
                    console.log(post.parentNode);
                    post.parentNode.removeChild(post);
                    console.log("success")
                },
                error: function (errorData) {
                    console.log("error")
                    console.log(errorData)
                }
            })
        }
    })
}

function setLikeText(obj, newVal) {
    if (newVal == 1) obj.text(newVal + " Like");
    else obj.text(newVal + " Likes");
}

function setClicked(btn, type, clicked) {
    if (clicked) {
        var add = "btn-" + type;
        var del = "btn-outline-" + type;
    }
    else {
        var add = "btn-outline-" + type;
        var del = "btn-" + type;
    }
    btn.addClass(add);
    btn.removeClass(del);
}

function markLiked() {
    var postsLikedUrl = $(".like-button-ajax").attr("liked-href")
    $.ajax({
        url: postsLikedUrl,
        method: "GET",
        data: {},
        success: function (data) {
            let buttons = $(".like-button-ajax");
            for (let i = 0; i < buttons.length; i++) {
                let id = $(buttons[i]).attr('id');
                if (data[id] == true)
                    setClicked($(buttons[i]), "success", true);
            }
        },
        error: function (errorData) {
            console.log("error")
            console.log(errorData)
        }
    })
}
const likeButton = () => {
    $(".like-button-ajax").on("click", function (event) {
        event.preventDefault();
        var thisBtn = $(this);
        var likeUrl = thisBtn.attr("data-href");
        var likesCount = parseInt(thisBtn.attr("data-likes"));
        var id = thisBtn.attr("id");

        $.ajax({
            url: likeUrl,
            method: "GET",
            data: {},
            success: function (data) {
                setClicked(thisBtn, "success", data.liked)
                if (data.liked) {
                    setLikeText(thisBtn, likesCount + 1);
                    $(thisBtn).attr("data-likes", likesCount + 1);
                } else {
                    setLikeText(thisBtn, likesCount - 1);
                    $(thisBtn).attr("data-likes", likesCount - 1);
                }
                console.log(data);
                console.log(id);
            },
            error: function (errorData) {
                console.log("error")
                console.log(errorData)
            }
        })
    })
}

const publishButton = () => {
    $(".button-publish").on("click", function (event) {
        event.preventDefault();
        var thisForm = $(".post-form-ajax");
        var actionEndpoint = thisForm.attr("action");
        var httpMethod = thisForm.attr("method");
        var formData = thisForm.serialize();

        $.ajax({
            url: actionEndpoint,
            method: httpMethod,
            data: formData,
            success: function (data) {
                //console.log(data)
                console.log("success")
            },
            error: function (errorData) {
                console.log("error")
                console.log(errorData)
            }
        })
    })
}
navSlide();
deleteButton();
publishButton();
likeButton();
markLiked();