from django.db import models
from apps.questions.models import Question


class Feedback(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='feedback')
    user_answer = models.TextField()
    score = models.DecimalField(max_digits=3, decimal_places=1)  # 0.0 – 10.0
    strengths = models.TextField(blank=True)
    improvements = models.TextField(blank=True)
    model_answer = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'feedback'
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback for Q{self.question.order} — Score: {self.score}"
