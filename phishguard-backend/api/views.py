from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Module
from .serializers import ModuleSerializer, ModuleListSerializer

# --- NEW IMPORTS FOR AI ---
import json
import os
from openai import OpenAI

# Initialize the OpenAI client. 
# Note: For testing, you can temporarily replace os.environ.get("OPENAI_API_KEY") 
# with your actual OpenAI API key string, but don't commit it to GitHub!
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


# 3. NEW function for fetching a single quiz
@api_view(['GET'])
def get_quiz_by_id(request, pk):
    try:
        module = Module.objects.get(pk=pk)
        serializer = ModuleSerializer(module)
        return Response(serializer.data)
    except Module.DoesNotExist:
        return Response(status=404)


# 4. NEW function for AI generated quiz using Few-Shot Prompting
@api_view(['POST', 'GET'])
def generate_ai_quiz(request):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert cybersecurity training engine. Your job is to generate a realistic, zero-day phishing scenario targeted at university students or small business employees. 
                    
                    Here are two examples from our threat dataset to guide your style:
                    Example 1: "Subject: Urgent: TU Dublin Library Account Suspension. Body: Dear Student, your library access will be revoked in 24 hours due to unpaid fines. Click here to resolve: http://tu-dublin-lib-update.com."
                    Example 2: "Subject: IT Helpdesk: Password Expiry. Body: Your university password expires today. Please retain your current password by verifying your credentials at this link: http://sso-update-portal.net."
                    
                    Based on these examples, generate a BRAND NEW, highly realistic phishing email. 
                    
                    You MUST return ONLY a raw JSON object with this exact structure (no markdown formatting, no extra text):
                    {
                        "type": "email",
                        "sender": "fake email address",
                        "subject": "compelling subject line",
                        "body": "the email content",
                        "isPhishing": true,
                        "red_flags_explanation": "Explain exactly 3 reasons why the user should have known this was phishing (e.g., sense of urgency, fake URL, generic greeting)."
                    }"""
                }
            ],
            temperature=0.7,
        )

        # Extract the text content from the AI response
        ai_content = response.choices[0].message.content
        
        # Safety check: Remove markdown backticks if the AI accidentally includes them
        if ai_content.startswith("```json"):
            ai_content = ai_content[7:-3].strip()
        elif ai_content.startswith("```"):
            ai_content = ai_content[3:-3].strip()

        # Parse it into a Python dictionary
        ai_quiz_data = json.loads(ai_content)

        # Send it to the React frontend
        return Response(ai_quiz_data)

    except Exception as e:
        print(f"AI Generation Error: {e}")
        return Response({"error": "Failed to generate AI scenario"}, status=500)