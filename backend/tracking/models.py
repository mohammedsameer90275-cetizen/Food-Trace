from django.conf import settings
from django.db import models


class TrackingRecord(models.Model):
    class Status(models.TextChoices):
        PRODUCED = "Produced", "Produced"
        COLLECTED = "Collected", "Collected"
        IN_TRANSIT = "In Transit", "In Transit"
        DELIVERED = "Delivered", "Delivered"
        IN_STOCK = "In Stock", "In Stock"
        SOLD = "Sold", "Sold"
        DAMAGED = "Damaged", "Damaged"

    product = models.ForeignKey("products.Product", on_delete=models.CASCADE, related_name="tracking_records")
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    role = models.CharField(max_length=20)
    location = models.CharField(max_length=160, blank=True)
    temperature = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    humidity = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=Status.choices)

    class Meta:
        ordering = ["timestamp"]
