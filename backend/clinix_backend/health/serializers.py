from rest_framework import serializers
from .models import Program, Client, Enrollment

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['id', 'title', 'description']

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class ClientProfileSerializer(serializers.ModelSerializer):
    programs = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ['id', 'full_name', 'date_of_birth', 'contact', 'programs']

    def get_programs(self, obj):
        return [{
            'id': en.program.id,
            'title': en.program.title,
            'description': en.program.description,
            'enrollment_id': en.id,
            'enrolled_on': en.enrolled_on
        } for en in obj.enrollments.all()]
