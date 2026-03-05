from rest_framework import serializers
from .models import Module, Question, Choice, UserModuleProgress

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct', 'feedback_text']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)  # Nest choices inside questions

    class Meta:
        model = Question
        fields = [
            'id', 'type', 'prompt_text', 
            'sender', 'subject', 'body', 'link_url', 
            'choices'
        ]

class ModuleSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True) # Nest questions inside modules

    class Meta:
        model = Module
        fields = ['id', 'title', 'description', 'questions']

class ModuleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'title', 'description']
