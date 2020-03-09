function toggleDropdown(post_id) {
    function outsideClickListener(event) {
        let condition1 = !$(event.target).parents('.options').length
        let condition2 = $(event.target).parents('.dropdown').length
        if (condition1 || condition2) {
            dropdown.style.display = 'none';
            document.removeEventListener('click', outsideClickListener);
        }
    }
    var dropdown = document.getElementById('dropdown-' + post_id);
    var button = document.getElementById('options-' + post_id);
    button.onclick = event => {
        dropdown.style.display = 'block';
        document.addEventListener('click', outsideClickListener);
    }
}
function postDetailRedirect(post_id) {
    $(document.getElementById("post-" + post_id)).click(function (e) {
        let condition1 = ['NAV', 'P'].includes(e.target.nodeName)
        let c1 = $(e.target).parents('.like-div').length
        let c2 = $(e.target).parents('.share').length
        let c3 = $(e.target).parents('.comment').length
        let c4 = $(e.target).parents('.options').length
        if (!c1 && !c2 && !c3 && !c4) {
            let post = $(this).parent('.post').prevObject.get(0)
            window.location.replace($(post).attr("href"));
        }
    })
}
function scrollLoad() {
    window.addEventListener('scroll', function (e) {
        let diff = document.getElementById('body').offsetHeight - (window.scrollY + window.innerHeight);
        if (diff < document.getElementById('footer').offsetHeight) loadPosts(3, 'posts');
        window.requestAnimationFrame(function () {
        });
    });
}
function markLiked(post_id) {
    var button = document.getElementById("like-button-" + post_id);
    var url = $(button).attr('is-liked')
}
function markHref(post_id) {
    var content;
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    if ((content = document.getElementById("content2-" + post_id)) != null);
    else if ((content = document.getElementById("content-" + post_id)) != null);
    else console.log('Can not find post with id:', post_id)
    content.innerHTML = content.innerHTML.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
}
function setLikeText(obj, newVal) {
    if (newVal == 1) $(obj).text(newVal + " Like");
    else $(obj).text(newVal + " Likes");
}
function confirmDelete() {
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
    if ($(content).attr('comment') == 'yes')
        content.style.display = 'inline-block';
    else content.style.display = 'flex';
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
//-----------------------
function postCreated(post_id) {
    document.getElementById('create-input').value = ''
    appendPost(document.getElementById('posts'), prepend, post_id);
}
function postLiked(post_id, isliked) {
    var el = $(document.getElementById("like-" + post_id))
    var likes_count = parseInt(el.attr('likes-count'));
    if (isliked) {
        el.children('.liked').css('opacity', '1')
        el.siblings('p').css('color', 'red')
        el.siblings('p').text(likes_count + 1)
        el.attr("likes-count", likes_count + 1);
    } else {
        el.children('.liked').css('opacity', '0')
        el.siblings('p').css('color', 'black')
        el.siblings('p').text(likes_count - 1)
        el.attr("likes-count", likes_count - 1);
    }
}
function postDeleted(post_id) {
    var post = document.getElementById("post-" + post_id);
    if (!post) post = document.getElementById("comment-" + post_id)
    post.parentNode.removeChild(post);
}
function postUpdated(post_id) {
    let authorHref = document.getElementById('at-author-' + post_id)
    var text = document.getElementById("input-" + post_id).value;
    $(document.getElementById("content1-" + post_id)).text(text);
    $(document.getElementById("content2-" + post_id)).text(text);
    let content = $(document.getElementById("content-" + post_id))
    $(document.getElementById("content-" + post_id)).text(' ' + text);
    if (content.attr('comment') == 'yes');
    // document.getElementById("content-" + post_id).prepend(authorHref);
    closeEdit(post_id);
    markHref(post_id);
}
//-----------------------
function apiRequest(url, method, data = {}) {
    var result = NaN;
    data['csrfmiddlewaretoken'] = csrf_token
    console.log(url, data)
    $.ajax({
        url: url,
        method: method,
        async: false,
        data: data,
        success: function (response) {
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
    var posts_loaded = document.getElementById(destination).childElementCount
    var lim = Math.min(posts_loaded + count, Object.keys(posts_ids).length)
    for (; posts_loaded < lim; posts_loaded++) {
        appendPost(document.getElementById(destination), append, posts_ids[posts_loaded]);
        // if (destination == 'posts') {
        //     let post_id = posts_ids[posts_loaded];
        //     let comments_ids = apiRequest(null, '/post/api/post/' + post_id + '/comments/', 'GET');
        //     if (comments_ids != null) {
        //         let comments_loaded = document.getElementById('comments-' + post_id).childElementCount
        //         for (; comments_loaded < comments_ids.length; comments_loaded++) {
        //             let comment_id = comments_ids[comments_loaded];
        //             appendPost(document.getElementById('comments-' + post_id), append, comment_id);
        //         }
        //     }
        // }
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
            markHref(post_id);
        },
        error: function (errorData) {
            console.log('error');
            console.log(errorData);
        }
    })
}
function addListeners(post_id) {
    likePostListener(post_id);
    deletePostListener(post_id);
    postDetailRedirect(post_id);
    editlListener(post_id);
    editOnClick(post_id);
    toggleDropdown(post_id);
}

var posts_ids = apiRequest('post/api/post/posts_ids', 'GET');
const prepend = 0;
const append = 1;
loadPosts(8, 'posts');
createPostListener();
scrollLoad()


function likePostListener(post_id) {
    $('#like-' + post_id).on('click', function () {
        let url = 'post/api/post/' + post_id + '/like/'
        let method = 'POST'
        let result = apiRequest(url, method)
        console.log(result['liked'])
        postLiked(post_id, result['liked'])
    })
}
function createPostListener() {
    $('.create').on('click', function () {
        let url = 'post/api/post/'
        let method = 'post'
        let content = document.getElementById('create-input').value
        let parent = $(this).attr('parent')
        let author = $(this).attr('author')
        let data = { 'content': content, 'parent': parent, 'author': author }
        let result = apiRequest(url, method, data)
        postCreated(result['id'])
    })
}
function deletePostListener(post_id) {
    $('#delete-' + post_id).on('click', function () {
        if (confirmDelete(post_id)) {
            let url = 'post/api/post/' + post_id + '/delete/'
            let method = 'post'
            if (apiRequest(url, method, {})) postDeleted(post_id)
        }
    })
}
function editlListener(post_id) {
    $('#edit-' + post_id).on('click', function () {
        let url = 'post/api/post/' + post_id + '/'
        let method = 'patch'
        let content = document.getElementById('create-input').value
        let data = { 'content': content }
        if (apiRequest(url, method, data)) postUpdated(post_id)
    })
}


