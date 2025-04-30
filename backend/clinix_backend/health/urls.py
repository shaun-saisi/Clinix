from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProgramViewSet,
    ClientViewSet,
    EnrollmentViewSet,
    DoctorViewSet,
    DoctorRegisterView,
    CustomTokenObtainPairView,
    DoctorMeView
)

router = DefaultRouter()
router.register(r'programs', ProgramViewSet, basename='program')
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'doctors', DoctorViewSet, basename='doctor')

urlpatterns = [
    path('', include(router.urls)),
    path('doctor/register/', DoctorRegisterView.as_view(), name='doctor-register'),
    path('doctor/me/', DoctorMeView.as_view(), name='doctor-me'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
