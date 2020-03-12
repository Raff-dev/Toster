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
function togglePublishButton(button_id, input_id) {
    var button = document.getElementById(button_id)
    var input = document.getElementById(input_id)
    button.disabled = true;
    input.onblur = fun
    input.onfocus = fun
    input.onkeyup = fun
    function fun() {
        if (input.value === "")
            button.disabled = true;
        else button.disabled = false;
    }
}
function addImage(input_id, iscomment = false) {
    $(input_id).on("change", function () {
        if (this.files && this.files[0]) {
            $(this.files).each((index, file) => {
                if (iscomment) create_files = comment_create_files
                else create_files = post_create_files
                create_files.push(file)
                var reader = new FileReader();
                reader.onload = event => {
                    var div = $(document.createElement('div'))
                    var close = $(document.createElement('div'))
                    var picture = "<img src='" + event.target.result + "' class='input-image'>"
                    div.addClass('create-image')
                    close.addClass('delete-image')
                    close.append("<div class='x1'></div><div class='x2'></div>")
                    div.append(picture, close)
                    if (iscomment) $("#modal-create-images").append(div);
                    else $("#create-images").append(div);
                    close.click(function () {
                        $(create_files).each((i, f) => {
                            if (f == file) create_files.splice(i, 1)
                        })
                        close.parent().remove()
                    })
                }
                reader.readAsDataURL(this.files[index]);
            })
        }

    });
}
function imagePreviewListener(img) {
    $(img).on("click", function () {
        $('.img-preview').find('.img').append(img.cloneNode())
        $('.img-preview').css('display', 'block')
        $('#close-img-modal').on('click', function () {
            $('.img-preview .img').empty()
            $('.img-preview').css('display', 'none')
        })
    })
}
function postDetailRedirect(post_id) {
    $(document.getElementById("post-" + post_id)).click(function (e) {
        let c1 = $(e.target).parents('.like-div').length
        let c2 = $(e.target).parents('.share').length
        let c3 = $(e.target).parents('.comment').length
        let c4 = $(e.target).parents('.options').length
        let c5 = $(e.target).parents('.post-images').length
        let c6 = $(e.target).parents('.img').length
        if (!c1 && !c2 && !c3 && !c4 && !c5 && !c6) {
            let post = $(this).parent('.post').prevObject.get(0)
            window.location.replace($(post).attr("href"));
        }
    })
}
function scrollLoad(count, destination) {
    window.addEventListener('scroll', function (e) {
        let diff = document.getElementById('body').offsetHeight - (window.scrollY + window.innerHeight);
        if (diff < document.getElementById('footer').offsetHeight) loadPosts(id_list, count, destination);
        window.requestAnimationFrame(function () {
        });
    });
}
function markLiked(post_id) {
    let el = $(document.getElementById("like-" + post_id))
    let url = $(el).attr('url')
    let method = 'get'
    let isliked = apiRequest(url, method)
    toggleLikeIcon(el, isliked)
}
function toggleLikeIcon(el, isliked) {
    if (isliked) {
        el.children('.liked').css('opacity', '1')
        el.siblings('p').css('color', 'red')
    } else {
        el.children('.liked').css('opacity', '0')
        el.siblings('p').css('color', 'black')
    }
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
        if (this.innerText == 'Edit') {
            document.querySelector("#edit-group-" + post_id).style.display = 'flex';
            document.querySelector("#content-div-" + post_id).style.display = 'none';
            $(this).text('Close');
            setClicked(this, 'primary');
        } else closeEdit(post_id);
    });
}
function loadPosts(id_list, count, destination_id) {
    var destination = document.getElementById(destination_id)
    var posts_loaded = destination.childElementCount
    var lim = Math.min(posts_loaded + count, Object.keys(id_list).length)
    for (; posts_loaded < lim; posts_loaded++) {
        appendPost((destination), append, id_list[posts_loaded]);
    }
}
function appendPost(node, mode, post_id) {
    let url = '/post/post_template/' + post_id
    let post = document.createElement('div')
    let response = apiRequest(url, 'GET')
    if (response != false) {
        post.innerHTML = response
        $(post).css('display', 'none')
        if (mode == append) node.append(post);
        else node.prepend(post);
        $(post).slideDown("fast")
        addListeners(post_id);
        markLiked(post_id);
        markHref(post_id);
        $(post).find('.image').each((index, elem) => {
            imagePreviewListener(elem)
        })
    }
}
//-----------------------
function postCreated(result, iscomment) {
    if (iscomment) {
        let parent_id = result['parent']
        comment_create_files = []
        url = $('#post-' + parent_id).attr('href')
        window.location = url
    }
    else {
        let post_id = result['id']
        document.getElementById('create-input').value = ''
        appendPost(document.getElementById('posts'), prepend, post_id);
        $('.create-images').empty()
        $('#create')[0].disabled = true
        post_create_files = []
    }
}
function postLiked(post_id, isliked) {
    var el = $(document.getElementById("like-" + post_id))
    var likes_count = parseInt(el.attr('likes-count'));
    if (isliked) {
        el.siblings('p').text(likes_count + 1)
        el.attr("likes-count", likes_count + 1);
    } else {
        el.siblings('p').text(likes_count - 1)
        el.attr("likes-count", likes_count - 1);
    }
    toggleLikeIcon(el, isliked)
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
function apiRequest(url, method, data = null) {
    console.log('url', url, 'data', data)
    var result = NaN;
    let contentType = false
    let processData = false
    if (data == null) {
        data = { "csrfmiddlewaretoken": csrf_token }
        contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
        processData = true
    }
    $.ajax({
        url: url,
        method: method,
        async: false,
        data: data,
        cache: false,
        processData: processData,
        contentType: contentType,
        success: function (response) {
            result = response;
        },
        error: function (errorData) {
            console.log('query error');
            console.log('errorData:', errorData);
            result = false
        }
    })
    return result;
}
function addListeners(post_id) {
    likePostListener(post_id);
    deletePostListener(post_id);
    commentPostListener(post_id)
    postDetailRedirect(post_id);
    editlListener(post_id);
    editOnClick(post_id);
    toggleDropdown(post_id);
}
function likePostListener(post_id) {
    $('#like-' + post_id).on('click', function () {
        let url = $(this).attr('url')
        let method = 'POST'
        let result = apiRequest(url, method, null)
        postLiked(post_id, result['liked'])
    })
}
function createPostListener(button, form_id, iscomment = false) {
    button.on('click', function () {
        var form = document.getElementById(form_id)
        let url = $(this).attr('url')
        let method = 'post'
        var files
        if (iscomment) files = comment_create_files
        else files = post_create_files
        var formData = new FormData(form)
        $(files).each((index) => {
            formData.append('img' + index, files[index])
        })
        formData.append('csrfmiddlewaretoken', csrf_token)
        let result = apiRequest(url, method, formData)
        postCreated(result, iscomment)
    })
}
function deletePostListener(post_id) {
    let btn_delete = document.getElementById("delete-" + post_id)
    if (btn_delete) {
        let btn_confirm = document.getElementById('alert-confirm')
        let btn_cancel = document.getElementById('alert-cancel')
        btn_delete.onclick = () => {
            $('#alert').css('display', 'flex')
            $('#alert-confirm').text('Delete Post?')
            $('#alert-title').text('Delete')
            btn_confirm.onclick = () => {
                let url = $(btn_delete).attr('url')
                let method = 'post'

                if (apiRequest(url, method)) {
                    postDeleted(post_id)
                    $('#alert').css('display', 'none')
                } else console.log('deletion failed')
                $(btn_delete).unbind()
                $(btn_cancel).unbind()

            }
            btn_cancel.onclick = () => {
                $('#alert').css('display', 'none')
                $(btn_delete).unbind()
                $(btn_cancel).unbind()
            }
        }
    }
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
function commentPostListener(post_id) {
    let destination = document.getElementById('comment-modal')
    $("#comment-" + post_id).on("click", function () {
        let url = $(this).attr('url')
        let method = 'GET'
        let modal = apiRequest(url, method)
        $(destination).empty()
        destination.innerHTML = modal
        closeCommentModal()
        createPostListener($("#modal-create"), "modal-create-form", true)
        togglePublishButton('modal-create', "modal-create-input")
        addImage('#modal-img-input', true)
    })
}
function closeCommentModal() {
    let btn_confirm = document.getElementById('alert-confirm')
    let btn_cancel = document.getElementById('alert-cancel')

    $("#close-comment-modal").on('click', function () {
        var inputval = document.getElementById('modal-create-input').value
        if (inputval.length) {
            $('#alert').css('display', 'flex')
            $('#alert-confirm').text('Discard Post?')
            $('#alert-title').text('Discard')

            btn_confirm.onclick = () => {
                comment_create_files = []
                $('#alert').css('display', 'none')
                $('#comment-modal').empty()
                $(btn_confirm).unbind()
                $(btn_cancel).unbind()
            }
            btn_cancel.onclick = () => {
                $('#alert').css('display', 'none')
                $(btn_confirm).unbind()
                $(btn_cancel).unbind()
            }
        } else {
            comment_create_files = []
            $('#comment-modal').empty()
        }
    })
}

const prepend = 0;
const append = 1;