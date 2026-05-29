from rest_framework import serializers
from .models import Feedback


class FeedbackSubmitSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer = serializers.CharField(min_length=10)


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'question', 'score', 'strengths', 'improvements', 'model_answer', 'created_at']
        read_only_fields = fields
