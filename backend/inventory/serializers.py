from rest_framework import serializers

from .models import InventoryItem


class InventorySerializer(serializers.ModelSerializer):
    product_id = serializers.CharField(source="product.product_id", read_only=True)
    product_name = serializers.CharField(source="product.product_name", read_only=True)

    class Meta:
        model = InventoryItem
        fields = ["id", "product", "product_id", "product_name", "retailer", "quantity", "low_stock_threshold", "is_sold", "is_damaged", "updated_at"]
        read_only_fields = ["retailer", "updated_at"]
