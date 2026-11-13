from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "Admin", "Admin"
        FARMER = "Farmer", "Farmer"
        DISTRIBUTOR = "Distributor", "Distributor"
        RETAILER = "Retailer", "Retailer"
        CONSUMER = "Consumer", "Consumer"

    fullname = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10, unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CONSUMER)
    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ["fullname", "email", "phone", "role"]

    def __str__(self):
        return f"{self.username} ({self.role})"


class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="preference")
    notify = models.BooleanField(default=False)
    autoRefresh = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Preferences for {self.user.username}"


class FarmerDetail(models.Model):
    name = models.CharField(max_length=150)
    village = models.CharField(max_length=150)
    phone = models.CharField(max_length=10)
    product = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
