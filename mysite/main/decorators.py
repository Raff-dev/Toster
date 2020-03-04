def log_form_data(func):
    def wrapper(*args, **kwargs):
        try:
            view_class = args[0]
            post_request = replace_key(
                view_class.request.POST, target_key='csrfmiddlewaretoken', replaceVal='CSRF TOKEN')
            print('ARGS: ', view_class.args)
            print('KWARGS:', view_class.kwargs)
            print('POST:', post_request)
            print('FILES:', view_class.request.FILES)
        except IndexError:
            print('No class found??')
        try:
            view_form = args[1]
            print('DATA:', view_form.cleaned_data)
        except IndexError:
            print('No form found')
        return func(*args, **kwargs)
    return wrapper


def replace_key(dictionary, target_key, replaceVal=None):
    """
    Takes a list of `dict` items and groups by ALL KEYS in the dict EXCEPT the key_field.
    :param list_of_dicts: List of dicts to group
    :param key_field: key field in dict which should be excluded from the grouping
    """
    output = {}
    for key, value in dictionary.items():
        if key == target_key and replaceVal:
            output[key] = replaceVal
        elif key == target_key and replaceVal is None:
            continue
        else:
            output[key] = value
    return output
