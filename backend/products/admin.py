from django.contrib import admin

from .models import Product, ProductCatalog


@admin.register(ProductCatalog)
class ProductCatalogAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "shelf_life_days", "default_storage_type", "is_active")
    search_fields = ("name", "category")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("product_id", "product_name", "farmer", "status", "freshness_score", "expiry_date")
    search_fields = ("product_id", "batch_id", "product_name", "farmer__fullname")
