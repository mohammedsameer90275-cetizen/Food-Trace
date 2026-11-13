from datetime import timedelta
from uuid import uuid4

from django.conf import settings
from django.db import models
from django.utils import timezone


class ProductCatalog(models.Model):
    class Category(models.TextChoices):
        VEGETABLE = "Vegetable", "Vegetable"
        FRUIT = "Fruit", "Fruit"

    name = models.CharField(max_length=80, unique=True)
    category = models.CharField(max_length=20, choices=Category.choices)
    shelf_life_days = models.PositiveIntegerField()
    default_storage_type = models.CharField(max_length=80, default="Cold Storage")
    ideal_temperature = models.DecimalField(max_digits=5, decimal_places=2, default=5)
    ideal_humidity = models.DecimalField(max_digits=5, decimal_places=2, default=80)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    class Status(models.TextChoices):
        FRESH = "Fresh", "Fresh"
        WARNING = "Warning", "Warning"
        EXPIRED = "Expired", "Expired"

    product_id = models.CharField(max_length=24, unique=True, editable=False)
    batch_id = models.CharField(max_length=24, unique=True, editable=False)
    product_name = models.CharField(max_length=80)
    category = models.CharField(max_length=30)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default="Kg")
    harvest_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    storage_type = models.CharField(max_length=80)
    temperature = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    humidity = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    freshness_score = models.PositiveIntegerField(default=100)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.FRESH)
    image = models.FileField(upload_to="products/", null=True, blank=True)
    qr_code = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="products",
    )
    assigned_distributor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_products",
        limit_choices_to={"role": "Distributor"},
    )
    assigned_retailer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="retail_products",
        limit_choices_to={"role": "Retailer"},
    )

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.product_id:
            self.product_id = f"FT{timezone.now():%Y%m%d}{uuid4().hex[:6].upper()}"
        if not self.batch_id:
            self.batch_id = f"BT{timezone.now():%Y%m%d}{uuid4().hex[:6].upper()}"
        if not self.expiry_date:
            catalog = ProductCatalog.objects.filter(name__iexact=self.product_name).first()
            shelf_life = catalog.shelf_life_days if catalog else 7
            self.expiry_date = self.harvest_date + timedelta(days=shelf_life)
        self.update_freshness()
        if not self.qr_code:
            self.qr_code = f"/product/{self.product_id}"
        super().save(*args, **kwargs)

    def update_freshness(self):
        today = timezone.localdate()
        total_days = max((self.expiry_date - self.harvest_date).days, 1)
        remaining_days = (self.expiry_date - today).days
        self.freshness_score = max(0, min(100, round((remaining_days / total_days) * 100)))
        if remaining_days < 0:
            self.status = self.Status.EXPIRED
        elif remaining_days <= 3:
            self.status = self.Status.WARNING
        else:
            self.status = self.Status.FRESH

    @property
    def days_remaining(self):
        return (self.expiry_date - timezone.localdate()).days

    def __str__(self):
        return f"{self.product_id} - {self.product_name}"
