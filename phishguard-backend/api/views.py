from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Module
from .serializers import ModuleSerializer, ModuleListSerializer

# --- IMPORTS FOR AI ---
import json
import os
import random
import datetime 
from openai import OpenAI

# Initialize the OpenAI client. 
# REPLACE THIS WITH YOUR NEW API KEY!
client = OpenAI(api_key="[ENCRYPTION_KEY]")

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