from django.utils import timezone
from django.db.models import Count
from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Interview
from .serializers import InterviewSerializer, InterviewCreateSerializer, InterviewSummarySerializer
from apps.questions.services import QuestionGeneratorService


class InterviewViewSet(ModelViewSet):
    serializer_class = InterviewSerializer

    def get_queryset(self):
        return Interview.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return InterviewCreateSerializer
        if self.action == 'list':
            return InterviewSummarySerializer
        return InterviewSerializer

    def perform_create(self, serializer):
        interview = serializer.save(user=self.request.user)
        # Generate questions for this interview
        QuestionGeneratorService.generate_for_interview(interview)

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        interview = self.get_object()
        if interview.status != 'pending':
            return Response({'detail': 'Interview already started or completed.'}, status=400)
        interview.status = 'in_progress'
        interview.started_at = timezone.now()
        interview.save()
        return Response(InterviewSerializer(interview).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        interview = self.get_object()
        if interview.status != 'in_progress':
            return Response({'detail': 'Interview is not in progress.'}, status=400)
        interview.status = 'completed'
        interview.completed_at = timezone.now()
        if interview.started_at:
            delta = interview.completed_at - interview.started_at
            interview.duration_seconds = int(delta.total_seconds())
        # Compute average score from feedback
        feedbacks = interview.questions.filter(feedback__isnull=False)
        scores = [f.feedback.score for f in feedbacks if hasattr(f, 'feedback')]
        if scores:
            interview.overall_score = round(sum(scores) / len(scores), 1)
        interview.save()
        return Response(InterviewSerializer(interview).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        qs = Interview.objects.filter(user=request.user, status='completed')
        total = qs.count()
        avg_score = None
        if total:
            scores = [i.overall_score for i in qs if i.overall_score is not None]
            avg_score = round(sum(float(s) for s in scores) / len(scores), 1) if scores else None
        return Response({
            'total_interviews': total,
            'average_score': avg_score,
            'by_role': list(qs.values('role').annotate(count=Count('id'))),
        })
