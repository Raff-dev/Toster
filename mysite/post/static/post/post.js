function markLiked() {
    var postsLikedUrl = $(".like-button-ajax").attr("liked-href")
    $.ajax({
        url: postsLikedUrl,
        method: "GET",
        data: {},
        success: function (data) {
            console.log('mark liked data:', data);
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
function resetForm(args) {
    console.log("successfully reseting");
    console.log('reset pk:', args['pk']);
    var form = args['form'];
    form.reset();
}
function updatePostText(args) {
    console.log("succesfully updating post");
    console.log('update post pk:', pk);
    var pk = args['pk'];
    var text = document.getElementById("input-" + pk).value;
    $(document.getElementById("content1-" + pk)).text(text);
    $(document.getElementById("content2-" + pk)).text(text);
    closeEdit(pk);
}
function closeEdit(pk) {
    var button = document.querySelector("#post-edit-button-" + pk);
    console.log('closing', pk);
    document.querySelector(".post-edit-group-" + pk).style.display = 'none';
    document.querySelector(".post-content-" + pk).style.display = 'flex';
    $(button).text('Edit');
    button.classList.add('btn-outline-primary');
    button.classList.remove('btn-primary');
}
function editOnClick() {
    $(".post-edit-button").on("click", function (event) {
        var pk = $(this).attr("pk")
        console.log('pk:', pk);
        if (this.innerText == 'Edit') {
            document.querySelector(".post-edit-group-" + pk).style.display = 'flex';
            document.querySelector(".post-content-" + pk).style.display = 'none';
            $(this).text('Close');
            console.log('opening');
            this.classList.add('btn-primary');
            this.classList.remove('btn-outline-primary');
        } else closeEdit(pk);
    });
}
function deletePost(args) {
    var pk = args['pk']
    console.log('i got his PK!:', pk);
    var post = document.getElementById("post-" + pk);
    console.log('deletepost func pk', pk);
    console.log(post.parentNode);
    post.parentNode.removeChild(post);
    console.log("success");
}
function confirmDelete(args) {
    if (window.confirm("Are you sure you want to delete this post?")) {
        console.log('Deletion confirmed');
        return true;
    } else {
        console.log('Deletion denied');
        return false;
    }
}

const likePost = () => {
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
function submitFormAjax(
    form = null,
    preFunc = null,
    successFunc = null,
    errorFunc = null,
    preArgs = {},
    successArgs = {},
    errorArgs = {},
) {
    $(form).submit(function (event) {
        event.preventDefault();

        if (preFunc)
            if (preFunc(preArgs) == false)
                return 0;

        var pk = $(this).attr("pk");
        var method = $(this).attr("method");
        var endPoint = $(this).attr("action");
        var formData = $(this).serialize();
        var formDataArray = $(this).serializeArray();

        successArgs['pk'] = pk;
        successArgs['form'] = this;
        errorArgs['pk'] = pk;
        errorArgs['form'] = this;

        if (pk) console.log('PK:', pk);
        else console.log('No PK given');
        jQuery.each(formDataArray, function (i, field) {
            if (i != 0)
                console.log('value(' + i + '):', field.value);
        });
        console.log('this1:', this);
        $.ajax({
            url: endPoint,
            method: method,
            data: formData,
            success: function (data) {
                console.log('success');
                if (successFunc) successFunc(successArgs);
            },
            error: function (errorData) {
                console.log('error');
                console.log(errorData);
                if (errorFunc) errorFunc(errorArgs);
            },
        })
    })
}

function loadTest() {
    $.ajax({
        url: 'post/post_template',
        method: 'GET',
        context: {},
        success: function (response) {
            $("#logo").html(response);
            console.log('response', response)
        }
    })
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        logo.innerHTML = this.response;
        console.log(this.response)
    };
    xhr.open('GET', '/', false);
    xhr.send();
}


var postsLoaded = 2;
const append = 1;
const prepend = 2;




function dataApiQuery(query, args = null) {
    var template = 'post/post_template/';
    var node = $('.load-post').attr('node');
    var mode = $('.load-post').attr('mode');
    $.ajax({
        url: 'post/data_api/',
        method: 'POST',
        data: {
            'query': query,
            'args': 'args',
            // 'query': query,
            // 'args': args,
        },
        success: function (response) {
            console.log('query succesfull');
            console.log('response', response);
            var lim = postsLoaded + 3;
            for (; postsLoaded <= lim; postsLoaded++) {
                console.log(postsLoaded, '- ID:', response[postsLoaded])
                appendPost(document.getElementById('post'), 1, response[postsLoaded]);
            }
            //return response;
        },
        error: function (errorData) {
            console.log('query error');
            console.log('errorData:', errorData);
        }
    })
}


function appendPost(node, mode, post_id, parent_id = null) {
    let url = 'post/post_template/' + post_id
    $.ajax({
        url: url,
        method: 'GET',
        data: {},
        success: function (response) {
            console.log('successfully appended post:', post_id);
            console.log('response', typeof (response))
            let post = document.createElement('div')
            post.innerHTML = response
            switch (mode) {
                case (append):
                    console.log('mode:append')
                    node.append(post);
                    break;
                case (preprend):
                    console.log('mode:prepend')
                    node.prepend(post);
                    break;
                default: console.log('Wrong mode value');
            }
        },
        error: function (errorData) {
            console.log('error');
            console.log(errorData);
        }
    })
}
$('#append-post').submit(function (event) {
    event.preventDefault();
    appendPost(document.getElementById('post'), 1, 120);

})
//appendPost(template, node, mode, response[postsLoaded]);

$('.load-post').on('click', function (event) {
    event.preventDefault();
    dataApiQuery('posts_ids_list', {});
})

markLiked();
editOnClick();
likePost();

submitFormAjax(".post-edit-form", null, updatePostText);
submitFormAjax(".post-create-form", null, resetForm);
submitFormAjax(".post-delete-form", confirmDelete, deletePost);
submitFormAjax(".post-comment-form", null);