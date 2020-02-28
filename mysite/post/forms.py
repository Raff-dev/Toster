from django import forms
from .models import Post

class PostForm(forms.Form):
    content = forms.CharField(max_length=300, help_text="What's up?", label="Post here", )

    class Meta:
        model = Post