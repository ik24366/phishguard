from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. USER MANAGEMENT
# -----------------------------------------------------------------------------
class User(AbstractUser):
    # We inherit standard fields (username, password, email).
    # Add a simple field for total XP/Points for your "Gamification" requirement.
    total_xp = models.IntegerField(default=0)

    # Track accessibility preference if you want to persist it across logins
    high_contrast_mode = models.BooleanField(default=False)


# 2. CONTENT STRUCTURE (The "Curriculum")
# -----------------------------------------------------------------------------
class Module(models.Model):
    title = models.CharField(max_length=200)  # e.g., "SMS & Mobile Alerts"
    description = models.TextField()
    order = models.IntegerField(default=1)  # To control which module appears first

    def __str__(self):
        return self.title


# 3. THE SCENARIOS (The tricky part)
# -----------------------------------------------------------------------------
class Question(models.Model):
    # Dropdown to tell React which component to render (Phone frame vs Email window)
    SCENARIO_TYPES = [
        ("EMAIL", "Email Interface"),
        ("SMS", "SMS Interface"),
        ("SOCIAL", "Social Media Feed"),
    ]

    module = models.ForeignKey(
        Module, related_name="questions", on_delete=models.CASCADE
    )
    type = models.CharField(max_length=10, choices=SCENARIO_TYPES, default="EMAIL")

    # The actual question prompt (e.g., "Is this SMS a phishing attempt?")
    prompt_text = models.CharField(
        max_length=255, default="Is this a phishing attempt?"
    )

    # -- SCENARIO CONTENT FIELDS --
    # These fields populate the "fake" message in your React components
    sender = models.CharField(max_length=255)  # e.g. "+44 7700 900123" or "IT Support"
    subject = models.CharField(max_length=255, blank=True, null=True)  # Only for Emails
    body = models.TextField()  # The main content of the phishing message
    link_url = models.CharField(
        max_length=255, blank=True, null=True
    )  # The fake link text

    def __str__(self):
        return f"{self.module.title} - {self.type} - {self.id}"


class Choice(models.Model):
    question = models.ForeignKey(
        Question, related_name="choices", on_delete=models.CASCADE
    )
    text = models.CharField(max_length=100)  # "Definitely phishing", "Legitimate"
    is_correct = models.BooleanField(default=False)

    # CRITICAL: This supports your "Immediate Feedback" requirement
    feedback_text = (
        models.TextField()
    )  # "Correct! Banks never ask for passwords via SMS..."

    def __str__(self):
        return f"{self.question.id} - {self.text}"


# 4. PROGRESS TRACKING (The "Save Game")
# -----------------------------------------------------------------------------
class UserModuleProgress(models.Model):
    user = models.ForeignKey(
        User, related_name="module_progress", on_delete=models.CASCADE
    )
    module = models.ForeignKey(Module, on_delete=models.CASCADE)

    is_completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)  # e.g., 8 (out of 10)
    last_attempted = models.DateTimeField(auto_now=True)

    class Meta:
        # Ensures one progress record per user per module
        unique_together = ["user", "module"]
