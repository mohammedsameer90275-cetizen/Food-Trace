from django.conf import settings
from django.db import models


class Notification(models.Model):
    class Type(models.TextChoices):
        NEAR_EXPIRY = "Product Near Expiry", "Product Near Expiry"
        EXPIRED = "Expired Product", "Expired Product"
        SHIPMENT_DELAY = "Shipment Delay", "Shipment Delay"
        TEMPERATURE_BREACH = "Temperature Breach", "Temperature Breach"
        LOW_STOCK = "Low Stock", "Low Stock"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    type = models.CharField(max_length=40, choices=Type.choices)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
