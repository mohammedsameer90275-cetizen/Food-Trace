from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    product_id = serializers.CharField(source="product.product_id", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "user", "product", "product_id", "type", "message", "is_read", "created_at"]
        read_only_fields = ["created_at"]
