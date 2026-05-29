from django.contrib import admin
from .models import Question

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['interview', 'topic', 'order', 'created_at']
    list_filter = ['topic']
    search_fields = ['text']
