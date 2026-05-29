from django.urls import path
from .views import SubmitAnswerView, InterviewFeedbackView

urlpatterns = [
    path('submit/', SubmitAnswerView.as_view(), name='submit-answer'),
    path('<int:interview_id>/', InterviewFeedbackView.as_view(), name='interview-feedback'),
]
