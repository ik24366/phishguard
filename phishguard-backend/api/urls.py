from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import get_quizzes, get_module_list, get_quiz_by_id, generate_ai_quiz

urlpatterns = [
    path('quizzes/', get_quizzes),
    path('modules/', get_module_list),
    path('quizzes/<int:pk>/', get_quiz_by_id),
    path('login/', obtain_auth_token, name='api_token_auth'), 
    path('generate-ai-quiz/', generate_ai_quiz, name='generate-ai-quiz'),
]
