from django.db import models
from apps.interviews.models import Interview


class Question(models.Model):
    TOPIC_CHOICES = [
        ('dsa', 'Data Structures & Algorithms'),
        ('system_design', 'System Design'),
        ('oops', 'Object Oriented Programming'),
        ('dbms', 'Database Management'),
        ('os', 'Operating Systems'),
        ('networking', 'Computer Networks'),
        ('react', 'React'),
        ('django', 'Django'),
        ('javascript', 'JavaScript'),
        ('python', 'Python'),
        ('behavioral', 'Behavioral'),
    ]

    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='questions')
    topic = models.CharField(max_length=30, choices=TOPIC_CHOICES)
    text = models.TextField()
    expected_keywords = models.JSONField(default=list)
    order = models.PositiveSmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'questions'
        ordering = ['order']

    def __str__(self):
        return f"Q{self.order}: {self.text[:60]}"
