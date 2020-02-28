from django.contrib import admin

from .models import Question, Choice

class ChoiceInLine(admin.TabularInline):
    model = Choice
    extra = 3


class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        ('sapnu puas', {
        'fields': ['question_text']
        }),
        ('Gimme the date, you fag', {
        'fields': ['pub_date','scrub_schroob'],
        'classes': ['collapse']
        })    
    ]
    inlines = [ChoiceInLine]
    list_display = ('question_text', 'pub_date', 'scrub_schroob','was_published_recently') 
    list_filter = ['pub_date','scrub_schroob']
    search_fields = ['question_text','pub_date']
    
admin.site.register(Question,QuestionAdmin)