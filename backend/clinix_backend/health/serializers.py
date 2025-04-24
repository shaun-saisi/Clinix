from rest_framework import serializers
from .models import Program, Client, Enrollment

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    programs = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = '__all__'

class ClientProfileSerializer(serializers.ModelSerializer):
    programs= serializers.SerializerMethodField()

    class Meta:
        model = Client    
        fields = ['id', 'full_name', 'date_of_birth', 'contact', 'programs']

    
    def get_programs(self, obj):
        return [en.program.name for en in obj.enrollment_set.all()]
