from django.shortcuts import render
from rest_framework import viewsets
from .models import Program, Client, Enrollment
from .serializers import ProgramSerializer, ClientSerializer, EnrollmentSerializer, ClientProfileSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        client = self.get_object()  # Fixed typo from 'clent' to 'client'
        serializer = ClientProfileSerializer(client)
        return Response(serializer.data)
    
class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer