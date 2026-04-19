from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Module,UserModuleProgress
from .serializers import ModuleSerializer, ModuleListSerializer
from django.contrib.auth.decorators import login_required
from api.models import UserModuleProgress
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()


# --- IMPORTS FOR AI ---
import json
import os
import random
import datetime 
from openai import OpenAI

# Initialize the OpenAI client using an environment variable
# Initialize the OpenAI client (checks for environment variable first, falls back to hardcoded key)
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@api_view(["GET"])
def get_quizzes(request):
    modules = Module.objects.all().order_by('order')
    serializer = ModuleSerializer(modules, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_module_list(request):
    modules = Module.objects.all().order_by('order')
    serializer = ModuleListSerializer(modules, many=True)
    return Response(serializer.data)

# 3. UPDATED function for fetching a single quiz with exactly 10 random questions
@api_view(['GET'])
def get_quiz_by_id(request, pk):
    try:
        module = Module.objects.get(pk=pk)
        serializer = ModuleSerializer(module)
        
        # 1. Convert the serialized data into a Python dictionary we can edit
        data = dict(serializer.data)
        
        # 2. Extract the questions list (default to empty list if none exist)
        questions = list(data.get('questions', []))
        
        # 3. Shuffle the questions randomly
        random.shuffle(questions)
        
        # 4. Slice the list to keep ONLY the first 10 questions (or fewer if there are less than 10)
        data['questions'] = questions[:10]
        
        return Response(data)
        
    except Module.DoesNotExist:
        return Response({"error": "Module not found"}, status=404)

# 4. FULLY DYNAMIC AI function
@api_view(['POST', 'GET'])
def generate_ai_quiz(request):
    try:
        # 1. Catch the variables React sent us (Default to mixed/intermediate if empty)
        vector = request.GET.get('vector', 'mixed')
        difficulty = request.GET.get('difficulty', 'intermediate')
        
        # 2. Create custom instructions based on the user's choices!
        vector_instruction = "Mix the scenarios across Email, SMS, and Social Media."
        if vector == "email":
            vector_instruction = "ALL 5 scenarios MUST be corporate or university Emails."
        elif vector == "sms":
            vector_instruction = "ALL 5 scenarios MUST be Mobile SMS text messages (Smishing)."
        elif vector == "social":
            vector_instruction = "ALL 5 scenarios MUST be Social Media interactions (Twitter, LinkedIn, Instagram DMs)."
            
        difficulty_instruction = "Make the attacks standard, easily recognizable phishing attempts."
        if difficulty == "advanced":
            difficulty_instruction = "Make the attacks highly sophisticated spear-phishing targeting specific university departments or corporate roles. Use subtle psychological manipulation."
        elif difficulty == "expert":
            difficulty_instruction = "Make the attacks incredibly complex Zero-Day exploits. Use zero grammatical errors, perfect corporate tone, advanced typosquatting, and multi-stage social engineering. Make it very hard for the user to detect."

        # 3. Send those custom instructions to OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are an expert cybersecurity training engine. 
                    Generate EXACTLY 5 highly realistic, completely unique, and modern scenarios.
                    Make 3 of them phishing, and 2 of them completely legitimate.
                    
                    USER CONFIGURATION:
                    - Vector Rule: {vector_instruction}
                    - Difficulty Rule: {difficulty_instruction}
                    
                    CRITICAL: Do NOT use placeholders like [Malicious Link]. You MUST invent a highly realistic, clickable URL string (e.g., 'https://secure-login-portal.net/auth' or 'https://tudublin.ie/student-hub').
                    
                    You must invent brand new scenarios every time. Do not repeat standard templates. Be creative. Use current events, new software tools, or unique social engineering angles.
                    
                    You MUST return ONLY a raw JSON array containing exactly 5 objects. No markdown, no intro text.
                    Use this EXACT structure for the array:
                    [
                        {{
                            "type": "EMAIL", // or "SMS" or "SOCIAL"
                            "sender": "The sender name and email/number/handle",
                            "subject": "The subject line (leave blank if SMS)",
                            "body": "The body content with the realistic URL included.",
                            "is_phishing": true, 
                            "feedback_text": "Explain exactly why this is phishing or why it is safe."
                        }}
                    ]"""
                }
            ],
            temperature=1.0, 
        )
        
        ai_content = response.choices[0].message.content
        
        if ai_content.startswith("```json"):
            ai_content = ai_content[7:-3].strip()
        elif ai_content.startswith("```"):
            ai_content = ai_content[3:-3].strip()

        generated_questions = json.loads(ai_content)

        if not isinstance(generated_questions, list):
            generated_questions = [generated_questions]

        ai_quiz_data = {
            "title": "Adaptive AI Scenario (5 Questions)",
            "description": "Dynamically generated, zero-day threat scenarios.",
            "questions": generated_questions 
        }

        return Response(ai_quiz_data)

    except Exception as e:
        print(f"AI Generation Error: {e}")
        return Response({"error": "Failed to generate AI scenario"}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    progress = UserModuleProgress.objects.filter(user=request.user).first()
    return Response({
        'level': getattr(progress, 'level', 1),
        'streak': getattr(progress, 'streak_count', 0),
        'score': getattr(progress, 'total_score', 0)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_progress(request):
    module_id = request.data.get("module_id")
    score = int(request.data.get("score", 0))
    completed = bool(request.data.get("completed", True))

    module = Module.objects.get(id=module_id)
    progress, created = UserModuleProgress.objects.get_or_create(
        user=request.user,
        module=module,
        defaults={
            "score": 0,
            "total_score": 0,
            "streak_count": 0,
            "level": 1,
            "is_completed": False,
        }
    )

    progress.score = score
    progress.total_score += score
    progress.is_completed = completed
    progress.last_attempted = timezone.now()

    if completed:
        progress.streak_count += 1

    if progress.total_score >= 100:
        progress.level = 2
    if progress.total_score >= 250:
        progress.level = 3

    progress.save()

    return Response({
        "success": True,
        "level": progress.level,
        "streak": progress.streak_count,
        "score": progress.total_score,
        "module_completed": progress.is_completed,
    })

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)
    
    # Create the user
    user = User.objects.create_user(username=username, password=password)
    
    # Create the token for the new user
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        "token": token.key,
        "username": user.username,
        "message": "User registered successfully"
    }, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_history(request):
    # Fetch all completed modules for this user, ordered by most recently attempted
    history = UserModuleProgress.objects.filter(user=request.user, is_completed=True).order_by('-last_attempted')
    data = []
    for progress in history:
        data.append({
            "id": progress.id,
            "module_title": progress.module.title,
            "score": progress.score,
            "last_attempted": progress.last_attempted
        })
    return Response(data)