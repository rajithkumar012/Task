from rest_framework import generics,permissions,viewsets
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .models import Task
from .serializers import RegisterSerializer,TaskSerializer,UserSerializer
import openai
from openai import OpenAIError, AuthenticationError, RateLimitError
import time
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from rest_framework.response  import Response
from rest_framework import status, permissions

class RegisterView(generics.CreateAPIView):
    serializer_class=RegisterSerializer
    
class UserDetailView(generics.RetrieveAPIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class=UserSerializer
    
    def get_object(self):
        return self.request.user
    

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        title = self.request.query_params.get('title', None)
        completed = self.request.query_params.get('completed', None)

        if title:
            queryset = queryset.filter(title__icontains=title)
        if completed is not None:
            queryset = queryset.filter(completed=completed.lower() in ['true', '1'])

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        

import logging
import threading
logger = logging.getLogger(__name__)

# ✅ Initialize OpenAI Client
client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

# ✅ Thread Lock to prevent concurrent API requests
lock = threading.Lock()

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def generate_task_description(request):
    """Generate a task description using OpenAI API based on the task title."""
    
    title = request.data.get("title", "").strip()
    if not title:
        return Response({"error": "Title is required"}, status=status.HTTP_400_BAD_REQUEST)

    retries = 5  # Max retry attempts
    delay = 5    # Initial delay in seconds

    with lock:  # Ensure only one request at a time
        for attempt in range(1, retries + 1):
            try:
                logger.debug(f"🔹 OpenAI API Key: {settings.OPENAI_API_KEY}")  # Debugging
                logger.debug(f"🔹 Task Title: {title}")

                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",  # Use GPT-3.5 (more available than GPT-4)
                    messages=[
                        {"role": "system", "content": "You are an AI assistant that generates helpful task descriptions."},
                        {"role": "user", "content": f"Generate a concise task description for: {title}"}
                    ],
                    max_tokens=30,  # Reduce token usage to prevent hitting limits
                    temperature=0.5  # Balanced response (lower = more predictable)
                )

                logger.debug(f"✅ OpenAI Response: {response}")  # Debugging
                description = response.choices[0].message.content
                return Response({"description": description}, status=status.HTTP_200_OK)

            except openai.RateLimitError:
                if attempt < retries:
                    logger.warning(f"⚠️ OpenAI rate limit exceeded. Retrying in {delay} seconds... (Attempt {attempt}/{retries})")
                    time.sleep(delay)  # Exponential backoff
                    delay *= 2  # Increase delay (5s → 10s → 20s → 40s → 80s)
                else:
                    logger.error("❌ OpenAI rate limit exceeded. Maximum retries reached.")
                    return Response({"error": "OpenAI rate limit exceeded. Please try again later."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

            except openai.AuthenticationError:
                logger.error("❌ Invalid OpenAI API key")
                return Response({"error": "Invalid OpenAI API key"}, status=status.HTTP_401_UNAUTHORIZED)

            except openai.OpenAIError as e:
                logger.error(f"❌ OpenAI API error: {e}")
                return Response({"error": f"OpenAI API error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            except Exception as e:
                logger.error(f"❌ Server error: {e}")
                return Response({"error": f"Server error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)