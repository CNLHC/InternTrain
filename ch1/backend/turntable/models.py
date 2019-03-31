from django.db import models

# Create your models here.

class Prize(models.Model):
    name = models.CharField(max_length=20,unique=True)
    chance = models.IntegerField()
