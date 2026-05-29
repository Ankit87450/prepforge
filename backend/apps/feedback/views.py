from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.questions.models import Question
from .models import Feedback
from .serializers import FeedbackSubmitSerializer, FeedbackSerializer
from .services import FeedbackService


class SubmitAnswerView(APIView):
    def post(self, request):
        serializer = FeedbackSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question_id = serializer.validated_data['question_id']
        user_answer = serializer.validated_data['answer']

        try:
            question = Question.objects.get(
                id=question_id,
                interview__user=request.user
            )
        except Question.DoesNotExist:
            return Response({'detail': 'Question not found.'}, status=404)

        if hasattr(question, 'feedback'):
            return Response({'detail': 'Answer already submitted.'}, status=400)

        result = FeedbackService.evaluate(question, user_answer)
        feedback = Feedback.objects.create(
            question=question,
            user_answer=user_answer,
            score=result['score'],
            strengths=result['strengths'],
            improvements=result['improvements'],
            model_answer=result['model_answer'],
        )
        return Response(FeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)


class InterviewFeedbackView(generics.ListAPIView):
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        return Feedback.objects.filter(
            question__interview__id=self.kwargs['interview_id'],
            question__interview__user=self.request.user
        ).select_related('question')
