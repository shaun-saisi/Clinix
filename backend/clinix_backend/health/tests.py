# This page contains all the test cases from the the views.py file, the serializers.py file and my models.py file 

from django.test import TestCase


from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Doctor, Program, Client, Enrollment
from .serializers import DoctorSerializer, ProgramSerializer, ClientSerializer

class TestModels(APITestCase):
    def setUp(self):
        self.doctor = Doctor.objects.create_user(
            username='dr_test',
            password='testpass123',
            specialization='Cardiology',
            phone='+1234567890'
        )
        self.client_patient = Client.objects.create(
            full_name='John Doe',
            date_of_birth='1990-01-01',
            contact='john@example.com',
            doctor=self.doctor
        )
        self.program = Program.objects.create(
            title='Diabetes Management',
            description='A program for diabetes patients',
            doctor=self.doctor
        )
        self.enrollment = Enrollment.objects.create(
            client=self.client_patient,
            program=self.program
        )

    def test_doctor_creation(self):
        self.assertEqual(self.doctor.specialization, 'Cardiology')
        self.assertTrue(self.doctor.check_password('testpass123'))
        self.assertEqual(str(self.doctor), 'dr_test')

    def test_program_creation(self):
        self.assertEqual(self.program.title, 'Diabetes Management')
        self.assertEqual(self.program.doctor, self.doctor)
        self.assertIsNotNone(self.program.created_at)

    def test_client_creation(self):
        self.assertEqual(self.client_patient.full_name, 'John Doe')
        self.assertEqual(self.client_patient.doctor, self.doctor)

    def test_enrollment_creation(self):
        self.assertEqual(self.enrollment.client, self.client_patient)
        self.assertEqual(self.enrollment.program, self.program)
        self.assertIsNotNone(self.enrollment.enrolled_on)

class TestSerializers(APITestCase):
    def setUp(self):
        self.doctor_data = {
            'username': 'dr_serializer',
            'password': 'serializerpass123',
            'specialization': 'Neurology',
            'phone': '+9876543210'
        }
        self.doctor = Doctor.objects.create_user(**self.doctor_data)

    def test_doctor_serializer(self):
        serializer = DoctorSerializer(instance=self.doctor)
        self.assertEqual(serializer.data['username'], self.doctor_data['username'])
        self.assertEqual(serializer.data['specialization'], self.doctor_data['specialization'])
        self.assertNotIn('password', serializer.data)

    def test_doctor_register_serializer(self):
        new_doctor_data = {
            'username': 'dr_new',
            'password': 'newpass123',
            'specialization': 'Pediatrics',
            'phone': '+1112223333'
        }
        serializer = DoctorRegisterSerializer(data=new_doctor_data)
        self.assertTrue(serializer.is_valid())
        doctor = serializer.save()
        self.assertEqual(doctor.username, new_doctor_data['username'])
        self.assertTrue(doctor.check_password(new_doctor_data['password']))

    def test_program_serializer(self):
        program = Program.objects.create(
            title='Test Program',
            description='Test Description',
            doctor=self.doctor
        )
        serializer = ProgramSerializer(instance=program)
        self.assertEqual(serializer.data['title'], 'Test Program')
        self.assertEqual(serializer.data['doctor'], self.doctor.id)

class TestAuthViews(APITestCase):
    def setUp(self):
        self.doctor = Doctor.objects.create_user(
            username='dr_auth',
            password='authpass123',
            specialization='Dermatology',
            phone='+5556667777'
        )
        self.client = APIClient()

    def test_doctor_registration(self):
        url = reverse('doctor_register_create')
        data = {
            'username': 'dr_new_user',
            'password': 'newuserpass123',
            'specialization': 'Oncology',
            'phone': '+9998887777'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Doctor.objects.count(), 2)

    def test_token_obtain(self):
        url = reverse('token_create')
        data = {
            'username': 'dr_auth',
            'password': 'authpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['username'], 'dr_auth')

    def test_doctor_me_view(self):
        url = reverse('doctor_me_list')
        self.client.force_authenticate(user=self.doctor)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'dr_auth')

class TestProtectedViews(APITestCase):
    def setUp(self):
        self.doctor = Doctor.objects.create_user(
            username='dr_protected',
            password='protectedpass123',
            specialization='Endocrinology',
            phone='+4443332222'
        )
        self.other_doctor = Doctor.objects.create_user(
            username='dr_other',
            password='otherpass123',
            specialization='Radiology',
            phone='+1112223333'
        )
        self.program = Program.objects.create(
            title='Protected Program',
            description='Protected Description',
            doctor=self.doctor
        )
        self.client_patient = Client.objects.create(
            full_name='Jane Doe',
            date_of_birth='1985-05-15',
            contact='jane@example.com',
            doctor=self.doctor
        )
        self.enrollment = Enrollment.objects.create(
            client=self.client_patient,
            program=self.program
        )
        
        # Get JWT token
        refresh = RefreshToken.for_user(self.doctor)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_program_list_create(self):
        url = reverse('programs_list')
        
        # Test list
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # Test create
        data = {
            'title': 'New Program',
            'description': 'New Description'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Program.objects.count(), 2)

    def test_client_profile_view(self):
        url = reverse('clients_profile', kwargs={'id': self.client_patient.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['full_name'], 'Jane Doe')
        self.assertEqual(len(response.data['programs']), 1)

    def test_enrollment_creation(self):
        url = reverse('enrollments_list')
        data = {
            'client': self.client_patient.id,
            'program': self.program.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # Already enrolled
        
        # Create new program
        new_program = Program.objects.create(
            title='New Program',
            description='New Desc',
            doctor=self.doctor
        )
        data['program'] = new_program.id
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_access_control(self):
        # Create client for other doctor
        other_client = Client.objects.create(
            full_name='Other Client',
            date_of_birth='2000-01-01',
            contact='other@example.com',
            doctor=self.other_doctor
        )
        
        # Try to access other doctor's client
        url = reverse('clients_read', kwargs={'id': other_client.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)