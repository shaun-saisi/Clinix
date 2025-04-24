from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgramViewSet, ClientViewSet, EnrollmentViewSet

router = DefaultRouter()
router.register(r'programs', ProgramViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'enrollments', EnrollmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]