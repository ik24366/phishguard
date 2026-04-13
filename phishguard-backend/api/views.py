from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Module
from .serializers import ModuleSerializer, ModuleListSerializer

# --- NEW IMPORTS FOR AI ---
import json
import os
import random
from openai import OpenAI

# Initialize the OpenAI client. 
# Note: For testing, you can temporarily replace os.environ.get("OPENAI_API_KEY") 
# with your actual OpenAI API key string, but don't commit it to GitHub!
client = OpenAI(api_key="...")


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
        # Pick 3 random themes for this specific generation so it's always different!
        themes = [
            "A fake IT Helpdesk warning about a mandatory password reset.",
            "A suspicious HR email containing an attached 'Salary Update 2026' PDF.",
            "A legitimate university newsletter about upcoming campus events.",
            "A smishing (SMS) text claiming a package delivery failed and requires a fee.",
            "A fake Library notification threatening to suspend their account for unpaid fines.",
            "A legitimate, boring Microsoft Teams notification about a missed chat.",
            "A spoofed email from the 'University President' asking for an urgent favor.",
            "A fake bank SMS stating a new device logged into their account.",
            "A legitimate email from a professor changing the date of the final exam."
        ]
        selected_themes = random.sample(themes, 3)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are an expert cybersecurity training engine. 
                    Generate EXACTLY 5 highly realistic scenarios for university students or non-IT employees.
                    Mix the scenarios: make 3 of them phishing, and 2 of them completely legitimate emails.
                    
                    CRITICAL: For this specific batch, you MUST heavily base your scenarios on these themes:
                    1. {selected_themes[0]}
                    2. {selected_themes[1]}
                    3. {selected_themes[2]}
                    
                    --- RESEARCH CONTEXT TO APPLY ---
                    Based on current cybersecurity literature, incorporate these specific trends into your phishing scenarios:
                    1. Authority & Urgency: Students are highly susceptible to fake IT Helpdesk notices, Library fine alerts, or exam portal warnings threatening account suspension.
                    2. Subdomain Typosquatting: Non-IT professionals often fall for URLs that look official but use hyphens or wrong TLDs (e.g., 'tu-dublin-portal.com' instead of 'tudublin.ie').
                    3. The Curiosity Lure: Employees often click fake HR salary updates, unexpected delivery texts (smishing), or internal policy changes.
                    4. Constructive Feedback: Your feedback MUST explicitly point out the exact psychological trick (e.g., "This used artificial urgency") and the technical flaw (e.g., "The sender email domain was spoofed").
                    ---------------------------------
                    
                    You MUST return ONLY a raw JSON array containing exactly 5 objects. No markdown, no intro text.
                    Use this EXACT structure for the array:
                    [
                        {{
                            "type": "EMAIL", // or "SMS"
                            "sender": "The sender name and email/number",
                            "subject": "The subject line (leave blank if SMS)",
                            "body": "The email or SMS body content",
                            "is_phishing": true, 
                            "feedback_text": "Explain exactly why this is phishing based on the research context OR why it is safe."
                        }}
                    ]"""
                }
            ],
            temperature=0.9, # Bumped slightly higher for more variety
        )

        # Extract the text content from the AI response
        ai_content = response.choices[0].message.content
        
        # Safety check: Remove markdown backticks if the AI accidentally includes them
        if ai_content.startswith("```json"):
            ai_content = ai_content[7:-3].strip()
        elif ai_content.startswith("```"):
            ai_content = ai_content[3:-3].strip()

        # Parse it into a Python list
        generated_questions = json.loads(ai_content)

        # Safety check: if the AI accidentally returned one object instead of a list, wrap it in a list
        if not isinstance(generated_questions, list):
            generated_questions = [generated_questions]

        # Wrap it so it matches your normal Django Module structure perfectly
        ai_quiz_data = {
            "title": "Adaptive AI Scenario (5 Questions)",
            "description": "Dynamically generated threat scenarios based on current research.",
            "questions": generated_questions 
        }

        # Send it to the React frontend
        return Response(ai_quiz_data)

    except Exception as e:
        print(f"AI Generation Error: {e}")
        return Response({"error": "Failed to generate AI scenario"}, status=500)