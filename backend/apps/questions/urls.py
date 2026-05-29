from django.urls import path
from .views import InterviewQuestionsView

urlpatterns = [
    path('<int:interview_id>/', InterviewQuestionsView.as_view(), name='interview-questions'),
]
