from django.conf import settings
from django.db import models


class InventoryItem(models.Model):
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE, related_name="inventory_items")
    retailer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="inventory")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    low_stock_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=5)
    is_sold = models.BooleanField(default=False)
    is_damaged = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("product", "retailer")
