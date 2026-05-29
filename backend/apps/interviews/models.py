from django.db import models
from apps.users.models import User


class Interview(models.Model):
    ROLE_CHOICES = [
        ('frontend', 'Frontend Engineer'),
        ('backend', 'Backend Engineer'),
        ('fullstack', 'Full Stack Engineer'),
        ('swe', 'Software Engineer'),
        ('dsa', 'Data Structures & Algorithms'),
    ]
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interviews')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    total_questions = models.PositiveSmallIntegerField(default=5)
    overall_score = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'interviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — {self.role} ({self.status})"
