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
function markLiked(post_id) {
    var button = document.getElementById("like-button-" + post_id);
    var url = $(button).attr('is-liked')
    $.ajax({
        url: url,
        method: "GET",
        data: {},
        success: function (liked) {
            if (liked) setClicked(button, "success");
        },
        error: function (errorData) {
            console.log("error")
            console.log(errorData)
        }
    })
}
function setLikeText(obj, newVal) {
    if (newVal == 1) $(obj).text(newVal + " Like");
    else $(obj).text(newVal + " Likes");
}
function setClicked(button, type) {
    $(button).toggleClass("btn-outline-" + type);
    $(button).toggleClass("btn-" + type);
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
function closeEdit(post_id) {
    var button = document.querySelector("#edit-button-" + post_id);
    document.querySelector("#edit-group-" + post_id).style.display = 'none';
    let content = document.querySelector("#content-div-" + post_id)

    content.style.display = 'flex';
    $(button).text('Edit');
    setClicked(button, 'primary');
}
function editOnClick(post_id) {
    $("#edit-button-" + post_id).on("click", function (event) {
        console.log('post_idd:', post_id);
        if (this.innerText == 'Edit') {
            document.querySelector("#edit-group-" + post_id).style.display = 'flex';
            document.querySelector("#content-div-" + post_id).style.display = 'none';
            $(this).text('Close');
            setClicked(this, 'primary');
        } else closeEdit(post_id);
    });
}
function submitFormAjax(
    form = null,
    preFunc = null,
    successFunc = null,
    preArgs = {},
    successArgs = {},
) {
    $(form).submit(function (event) {
        event.preventDefault();

        if (preFunc)
            if (preFunc(preArgs) == false)
                return 0;

        var post_id = $(this).attr("post_id");
        var method = $(this).attr("method");
        var endPoint = $(this).attr("action");
        console.log('url:', endPoint)
        var formData = $(this).serialize();
        var formDataArray = $(this).serializeArray();

        successArgs['post_id'] = post_id;
        successArgs['form'] = this;
        successArgs['data'] = formDataArray

        if (post_id) console.log('post_id:', post_id);
        else console.log('No post_id given');
        jQuery.each(formDataArray, function (i, field) {
            console.log('value(' + i + '):', field.value);
        });
        $.ajax({
            url: endPoint,
            method: method,
            data: formData,
            success: function (data) {
                // console.log('data from submiting post', data)
                console.log('success');
                if (successFunc) successFunc(successArgs, data);
            },
            error: function (errorData) {
                console.log('error');
                console.log(errorData);
            },
        })
    })
}
function postCreated(args, response) {
    var post_id = response['id'];
    var form = args['form'];
    form.reset();
    var parent_id = response['parent'];
    if (parent_id) {
        appendPost(document.getElementById("comments-" + parent_id), append, post_id, parent_id);
    }
    else {
        appendPost(document.getElementById('posts'), prepend, post_id);
    }
    submitFormAjax("#edit-form-" + post_id, null, postUpdated);
    submitFormAjax("#delete-form-" + post_id, confirmDelete, postDeleted);
    submitFormAjax("#comment-form-" + post_id, null, postCreated);
}
function postLiked(args, response) {
    var post_id = response['id'];
    var button = document.getElementById("like-button-" + post_id);
    var likes_count = parseInt($(button).attr('likes-count'));
    setClicked(button, "success");
    if (response['liked']) {
        setLikeText(button, likes_count + 1);
        $(button).attr("likes-count", likes_count + 1);
    } else {
        setLikeText(button, likes_count - 1);
        $(button).attr("likes-count", likes_count - 1);
    }
}
function postDeleted(args, response) {
    var post_id = args['post_id']
    var post = document.getElementById("post-" + post_id);
    if (!post) post = document.getElementById("comment-" + post_id)
    console.log('Deleting: ', post_id);
    console.log(post.parentNode);
    post.parentNode.removeChild(post);
}
function postUpdated(args, response) {
    let post_id = args['post_id'];
    let authorHref = document.getElementById('at-author-' + post_id)
    var text = document.getElementById("input-" + post_id).value;
    $(document.getElementById("content1-" + post_id)).text(text);
    $(document.getElementById("content2-" + post_id)).text(text);
    let content = $(document.getElementById("content-" + post_id))
    $(document.getElementById("content-" + post_id)).text(' ' + text);
    if (content.attr('comment') == 'yes')
        document.getElementById("content-" + post_id).prepend(authorHref);
    closeEdit(post_id);
}
function apiRequest(query, url, method, args = null) {
    var result = NaN;
    $.ajax({
        url: url,
        method: method,
        async: false,
        data: {
            'query': query,
            'args': args,
            // 'query': query,
            // 'args': args,
        },
        success: function (response) {
            console.log('query succesfull');
            console.log('response', response['1']);
            result = response;
        },
        error: function (errorData) {
            console.log('query error');
            console.log('errorData:', errorData);
        }
    })
    return result;
}
function loadPosts(count, destination) {
    let posts_ids = apiRequest('posts_ids_list', 'post/data_api/', 'POST');
    if (posts_ids[Object.keys(posts_ids).length - 1]) {
        var posts_loaded = document.getElementById(destination).childElementCount
        var lim = posts_loaded + count
        for (; posts_loaded < lim; posts_loaded++) {
            let post_id = posts_ids[posts_loaded];
            appendPost(document.getElementById(destination), append, posts_ids[posts_loaded]);
            if (destination == 'posts') {
                let comments_ids = apiRequest(null, '/post/api/post/' + post_id, 'GET')['comments'];
                if (comments_ids.length) {
                    let comments_loaded = document.getElementById('comments-' + post_id).childElementCount
                    for (; comments_loaded < comments_ids.length; comments_loaded++) {
                        let comment_id = comments_ids[comments_loaded];
                        appendPost(document.getElementById('comments-' + post_id), append, comment_id);
                    }
                }
            }
        }
    }
}
function appendPost(node, mode, post_id, is_comment = null) {
    let url = 'post/post_template/' + post_id
    $.ajax({
        url: url,
        method: 'GET',
        async: false,
        data: {},
        success: function (response) {
            let post = document.createElement('div')
            post.innerHTML = response
            switch (mode) {
                case (append):
                    node.append(post);
                    break;
                case (prepend):
                    node.prepend(post);
                    break;
                default: ;
            }
            addListeners(post_id);
            markLiked(post_id);
        },
        error: function (errorData) {
            console.log('error');
            console.log(errorData);
        }
    })
}
function addListeners(post_id) {
    submitFormAjax("#edit-form-" + post_id, null, postUpdated);
    submitFormAjax("#delete-form-" + post_id, confirmDelete, postDeleted);
    submitFormAjax("#comment-form-" + post_id, null, postCreated);
    submitFormAjax("#like-form-" + post_id, null, postLiked);
    editOnClick(post_id);
}

const prepend = 0;
const append = 1;

$(document).ready(function () {
    submitFormAjax(".post-create-form", null, postCreated);
    loadPosts(5, 'posts');
});

window.addEventListener('scroll', function (e) {
    let diff = document.getElementById('body').offsetHeight - (window.scrollY + window.innerHeight);
    if (diff < document.getElementById('footer').offsetHeight) loadPosts(3, 'posts');

    window.requestAnimationFrame(function () {
    });
});