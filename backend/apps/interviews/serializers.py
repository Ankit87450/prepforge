from rest_framework import serializers
from .models import Interview


class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = '__all__'
        read_only_fields = ['user', 'status', 'overall_score', 'duration_seconds',
                            'started_at', 'completed_at', 'created_at']


class InterviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ['id', 'role', 'difficulty', 'total_questions']
        read_only_fields = ['id']


class InterviewSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ['id', 'role', 'difficulty', 'status', 'overall_score',
                  'total_questions', 'duration_seconds', 'created_at']
