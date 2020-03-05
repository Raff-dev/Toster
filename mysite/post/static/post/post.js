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
            console.log('ID: ', post_id, ' liked:', liked);
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
    console.log('closing', post_id);
    document.querySelector("#edit-group-" + post_id).style.display = 'none';
    document.querySelector("#content-" + post_id).style.display = 'flex';
    $(button).text('Edit');
    setClicked(this, 'primary');
}
function editOnClick(post_id) {
    $("#edit-button-" + post_id).on("click", function (event) {
        console.log('post_id:', post_id);
        if (this.innerText == 'Edit') {
            document.querySelector("#edit-group-" + post_id).style.display = 'flex';
            document.querySelector("#content-" + post_id).style.display = 'none';
            $(this).text('Close');
            console.log('opening');
        } else closeEdit(post_id);
        setClicked(this, 'primary');
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
            if (i != 0)
                console.log('value(' + i + '):', field.value);
        });
        $.ajax({
            url: endPoint,
            method: method,
            data: formData,
            success: function (data) {
                console.log('data from submiting post', data)
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
        console.log('Comment Created: ', post_id, 'Parent: ', parent_id);
        appendPost(document.getElementById("comments-" + parent_id), append, post_id, parent_id);
    }
    else {
        console.log('Post Created: ', post_id);
        appendPost(document.getElementById('posts'), prepend, post_id);
    }
    submitFormAjax("#edit-form-" + post_id, null, postUpdated);
    submitFormAjax("#delete-form-" + post_id, confirmDelete, postDeleted);
    submitFormAjax("#comment-form-" + post_id, null, postCreated);
}
function postLiked(args, response) {
    var post_id = response['id'];
    console.log('post liked id', post_id);
    var button = document.getElementById("like-button-" + post_id);
    console.log('button', button);
    var likes_count = parseInt($(button).attr('likes-count'));
    console.log('likes count:', likes_count);
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
    var id = args['post_id'];
    console.log('update post id:', id);
    var text = document.getElementById("input-" + id).value;
    $(document.getElementById("content1-" + id)).text(text);
    $(document.getElementById("content2-" + id)).text(text);
    closeEdit(id);
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
    var postsLoaded = document.getElementsByClassName(destination).length
    console.log('posts count', postsLoaded);
    let postsIds = apiRequest('posts_ids_list', 'post/data_api/', 'POST');
    console.log('those should be posts ids', postsIds)
    // jQuery.each(postsIds.serializeArray(), function (i, field) {
    //     console.log('value(' + i + '):', field.value);
    // });
    var lim = postsLoaded + count
    for (; postsLoaded < lim; postsLoaded++) {
        let post_id = postsIds[postsLoaded];
        console.log(postsLoaded, '- ID:', postsIds[postsLoaded], 'or', post_id)
        appendPost(document.getElementById(destination), append, postsIds[postsLoaded]);
        if (destination == 'posts') {
            let comments_ids = apiRequest(null, '/post/api/post/' + post_id, 'GET')['comments'];
            for (let i = 0; i < comments_ids.length; i++) {
                let comment_id = comments_ids[i];
                appendPost(document.getElementById('comments-' + post_id), append, comment_id);

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
            console.log('Appending post:', post_id, ' to node\n', node);
            let post = document.createElement('div')
            post.innerHTML = response
            switch (mode) {
                case (append):
                    console.log('mode:append')
                    node.append(post);
                    break;
                case (prepend):
                    console.log('mode:prepend')
                    node.prepend(post);
                    break;
                default: console.log('Wrong mode value');
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
    console.log('READY')
    loadPosts(5, 'posts');
});