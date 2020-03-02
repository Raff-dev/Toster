def log_form_data(func):
    def wrapper(*args, **kwargs):
        try:
            view_class = args[0]
            print('ARGS: ', view_class.args)
            print('KWARGS:', view_class.kwargs)
            print('request.POST:', view_class.request.POST)
            print('request.FILES:', view_class.request.FILES)
        except IndexError:
            print('No class found??')
        try:
            view_form = args[1]
            print('clean data:', view_form.cleaned_data)
        except IndexError:
            print('No form found')
        return func(*args, **kwargs)
    return wrapper
