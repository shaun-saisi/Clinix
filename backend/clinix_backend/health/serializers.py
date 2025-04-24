from rest_framework import serializers
from .models import Program, Client, Enrollment

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program  # Changed from Client to Program
        fields = ['id', 'title', 'description']  # Updated fields

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment  # Changed from Client to Enrollment
        fields = '__all__'

class ClientProfileSerializer(serializers.ModelSerializer):
    programs = serializers.SerializerMethodField()

    class Meta:
        model = Client    
        fields = ['id', 'full_name', 'date_of_birth', 'contact', 'programs']
    
    def get_programs(self, obj):
        # Changed to use program.title instead of name
        return [{
            'title': en.program.title,
            'description': en.program.description
        } for en in obj.enrollment_set.all()]