from django.urls import path,include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .views import RegisterView,UserDetailView,TaskViewSet,generate_task_description

router=DefaultRouter()
router.register(r'tasks',TaskViewSet,basename='task')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', UserDetailView.as_view(), name='user-detail'),
    path("tasks/generate-task-description/", generate_task_description, name="generate-task-description"),
    path('', include(router.urls)),
]
