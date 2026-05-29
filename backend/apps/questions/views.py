from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Question
from .serializers import QuestionSerializer


class InterviewQuestionsView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Question.objects.filter(
            interview__id=self.kwargs['interview_id'],
            interview__user=self.request.user
        )
