from django import forms
from .models import Post


class PostForm(forms.ModelForm):
    content = forms.CharField(max_length=300, widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'What are you thinking about?',
    }
    ))
    img = forms.ImageField()

    class Meta:
        model = Post
        fields = ['content', 'img']
