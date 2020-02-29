const NavSlide = () => {
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

const DeletePost = () => {
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
function closeEdit(id) {
    var button = document.querySelector(".post-edit-button");
    console.log('closing', id);
    document.querySelector(".post-edit-group-" + id).style.display = 'none';
    document.querySelector(".post-content-" + id).style.display = 'flex';
    $(button).text('Edit');
    button.classList.add('btn-outline-primary');
    button.classList.remove('btn-primary');
}

const EditPost = () => {
    $(".post-edit-button").on("click", function (event) {
        var id = $(this).attr("id")

        if (this.innerText == 'Edit') {
            document.querySelector(".post-edit-group-" + id).style.display = 'flex';
            document.querySelector(".post-content-" + id).style.display = 'none';
            $(this).text('Close');
            console.log('opening');
            this.classList.add('btn-primary');
            this.classList.remove('btn-outline-primary');
        } else closeEdit(id);
    });

    $(".post-edit-form").submit(function (event) {
        event.preventDefault();

        var form = $(this);
        var id = $(".post-edit-button").attr("id");
        var method = $(this).attr("method");
        var endPoint = $(this).attr("action");
        var formData = $(this).serialize();
        console.log(id);
        console.log('form data', formData);


        $.ajax({
            url: endPoint,
            method: method,
            data: formData,

            success: function (data) {
                console.log("post updated");
                var text = document.getElementById("input-" + id).value;
                $(document.getElementById("content1-" + id)).text(text);
                $(document.getElementById("content2-" + id)).text(text);
                console.log(document.getElementById("content1-" + id));
                closeEdit(id);
            },
            error: function (error) {
                console.log("error: updating post");

            },
        })
    })
};

function SetLikeText(obj, newVal) {
    if (newVal == 1) obj.text(newVal + " Like");
    else obj.text(newVal + " Likes");
}

function SetClicked(btn, type, clicked) {
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

function MarkLiked() {
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
                    SetClicked($(buttons[i]), "success", true);
            }
        },
        error: function (errorData) {
            console.log("error")
            console.log(errorData)
        }
    })
}
const LikePost = () => {
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
                SetClicked(thisBtn, "success", data.liked)
                if (data.liked) {
                    SetLikeText(thisBtn, likesCount + 1);
                    $(thisBtn).attr("data-likes", likesCount + 1);
                } else {
                    SetLikeText(thisBtn, likesCount - 1);
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

const PublishPost = () => {
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
                thisForm[0].reset();
                console.log("success")
            },
            error: function (errorData) {
                console.log("error")
                console.log(errorData)
            }
        })
    })
}
NavSlide();
MarkLiked();
DeletePost();
EditPost();
LikePost();
PublishPost();