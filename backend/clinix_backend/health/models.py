from django.db import models
from django.contrib.auth.models import AbstractUser

class Doctor(AbstractUser):
    specialization = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    
    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Doctor'
        verbose_name_plural = 'Doctors'

class Program(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    doctor = models.ForeignKey(
        Doctor, 
        on_delete=models.CASCADE, 
        related_name='programs'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Client(models.Model):
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    contact = models.CharField(max_length=50)
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name='clients'
    )

    def __str__(self):
        return self.full_name

class Enrollment(models.Model):
    client = models.ForeignKey(
        Client, 
        on_delete=models.CASCADE, 
        related_name='enrollments'
    )
    program = models.ForeignKey(
        Program, 
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrolled_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('client', 'program')
        ordering = ['-enrolled_on']