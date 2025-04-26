from rest_framework import serializers
from .models import Program, Client, Enrollment, Doctor
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'username', 'specialization', 'phone']
        read_only_fields = ['id']

class DoctorRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['username', 'password', 'specialization', 'phone']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': True},
            'specialization': {'required': True},
            'phone': {'required': True}
        }

    def create(self, validated_data):
        return Doctor.objects.create_user(**validated_data)

class ProgramSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    
    class Meta:
        model = Program
        fields = ['id', 'title', 'description', 'created_at', 'doctor']
        read_only_fields = ['id', 'created_at', 'doctor']

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'full_name', 'date_of_birth', 'contact', 'doctor']
        read_only_fields = ['id', 'doctor']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'client', 'program', 'enrolled_on']
        read_only_fields = ['id', 'enrolled_on']

class ClientProfileSerializer(serializers.ModelSerializer):
    programs = serializers.SerializerMethodField()
    date_of_birth = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Client
        fields = ['id', 'full_name', 'date_of_birth', 'contact', 'programs']
        read_only_fields = ['id', 'programs']

    def get_programs(self, obj):
        return [{
            'id': en.program.id,
            'title': en.program.title,
            'enrollment_id': en.id,
            'enrolled_on': en.enrolled_on.strftime("%Y-%m-%d %H:%M")
        } for en in obj.enrollments.all()]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'doctor_id': self.user.id,
            'username': self.user.username,
            'specialization': self.user.specialization
        })
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['doctor_id'] = user.id
        token['username'] = user.username
        token['specialization'] = user.specialization
        return token