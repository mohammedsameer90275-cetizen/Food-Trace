from rest_framework import serializers

from .models import TrackingRecord


class TrackingRecordSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.fullname", read_only=True)
    product_id = serializers.CharField(source="product.product_id", read_only=True)
    product_name = serializers.CharField(source="product.product_name", read_only=True)

    class Meta:
        model = TrackingRecord
        fields = [
            "id",
            "product",
            "product_id",
            "product_name",
            "actor",
            "actor_name",
            "role",
            "location",
            "temperature",
            "humidity",
            "timestamp",
            "status",
        ]
        read_only_fields = ["actor", "role", "timestamp"]
