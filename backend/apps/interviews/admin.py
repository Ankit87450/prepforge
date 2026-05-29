from django.contrib import admin
from .models import Interview

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'difficulty', 'status', 'overall_score', 'created_at']
    list_filter = ['role', 'difficulty', 'status']
    search_fields = ['user__email']
    ordering = ['-created_at']
