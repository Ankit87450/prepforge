from rest_framework import serializers
from .models import Question


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'topic', 'text', 'order', 'interview']
        read_only_fields = ['id', 'topic', 'text', 'order', 'interview']
