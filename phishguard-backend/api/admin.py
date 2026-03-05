from django.contrib import admin

# Register your models here.
from .models import Module, Question, Choice, UserModuleProgress

admin.site.register(Module)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(UserModuleProgress)