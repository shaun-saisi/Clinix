from django.db import models

class Program(models.Model):
    title = models.CharField(max_length=100)  
    description = models.TextField()  

    def __str__(self):
        return self.title  

class Client(models.Model):
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    contact = models.CharField(max_length=50)

    def __str__(self):
        return self.full_name

class Enrollment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='enrollments')
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    enrolled_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('client', 'program')
