from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser

# 1) USER (extend later if needed)
class User(AbstractUser):
    total_xp = models.IntegerField(default=0)
    high_contrast_mode = models.BooleanField(default=False)


# 2) TRAINING MODULE (e.g. SMS, Email)
class Module(models.Model):
    title = models.CharField(max_length=200)          # "SMS & Mobile Alerts"
    description = models.TextField(blank=True)
    order = models.IntegerField(default=1)

    def __str__(self):
        return self.title


# 3) QUESTION / SCENARIO
class Question(models.Model):
    SCENARIO_TYPES = [
        ('EMAIL', 'Email'),
        ('SMS', 'SMS'),
        ('SOCIAL', 'Social'),
        ('VISHING', 'Vishing/Voice'),
    ]

    module = models.ForeignKey(Module, related_name='questions',
                               on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=SCENARIO_TYPES, default='EMAIL')

    prompt_text = models.CharField(max_length=255, default="Is this a phishing attempt?")

    sender = models.CharField(max_length=255)                # "+44 7700 900123" / "IT Support"
    subject = models.CharField(max_length=255, blank=True)   # email only
    body = models.TextField()                                # main message text
    link_url = models.CharField(max_length=255, blank=True)  # http://secure-bank-login-help.com

    def __str__(self):
        return f"{self.module.title} - {self.type} - {self.id}"


# 4) ANSWER CHOICES
class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices',
                                 on_delete=models.CASCADE)
    text = models.CharField(max_length=100)          # "Definitely phishing"
    is_correct = models.BooleanField(default=False)
    feedback_text = models.TextField()               # explanation shown after answer

    def __str__(self):
        return f"{self.question.id} - {self.text}"


# 5) USER PROGRESS
class UserModuleProgress(models.Model):
    streak_count = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    total_score = models.IntegerField(default=0)
    user = models.ForeignKey(User, related_name='module_progress',
                             on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    last_attempted = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'module']
