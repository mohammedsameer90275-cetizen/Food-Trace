from rest_framework import serializers
from django.utils import timezone

from tracking.models import TrackingRecord
from .models import Product, ProductCatalog


class ProductCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCatalog
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    farmer = serializers.CharField(source="farmer.fullname", read_only=True)
    productName = serializers.CharField(source="product_name", read_only=True)
    batch = serializers.CharField(source="batch_id", read_only=True)
    expiry = serializers.DateField(source="expiry_date", read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    stage = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "product_id",
            "productName",
            "product_name",
            "category",
            "quantity",
            "unit",
            "harvest_date",
            "expiry_date",
            "expiry",
            "storage_type",
            "temperature",
            "humidity",
            "freshness_score",
            "status",
            "image",
            "qr_code",
            "created_at",
            "farmer",
            "batch_id",
            "batch",
            "days_remaining",
            "stage",
            "location",
            "assigned_distributor",
            "assigned_retailer",
        ]
        read_only_fields = ["product_id", "batch_id", "expiry_date", "freshness_score", "status", "qr_code", "created_at"]

    def get_stage(self, obj):
        latest = obj.tracking_records.order_by("-timestamp").first()
        return latest.status if latest else "Produced"

    def get_location(self, obj):
        latest = obj.tracking_records.order_by("-timestamp").first()
        return latest.location if latest else ""

    def to_internal_value(self, data):
        normalized = data.copy()
        if normalized.get("productName") and not normalized.get("product_name"):
            normalized["product_name"] = normalized["productName"]
        if normalized.get("expiry") and not normalized.get("expiry_date"):
            normalized["expiry_date"] = normalized["expiry"]
        if not normalized.get("quantity"):
            normalized["quantity"] = 1
        if not normalized.get("unit"):
            normalized["unit"] = "Kg"
        if not normalized.get("harvest_date"):
            normalized["harvest_date"] = timezone.localdate().isoformat()
        if not normalized.get("storage_type"):
            catalog = ProductCatalog.objects.filter(name__iexact=normalized.get("product_name", "")).first()
            normalized["storage_type"] = catalog.default_storage_type if catalog else "Cold Storage"
        normalized.pop("farmer", None)
        normalized.pop("batch", None)
        normalized.pop("status", None)
        normalized.pop("freshness_score", None)
        return super().to_internal_value(normalized)

    def validate(self, attrs):
        user = self.context["request"].user
        if user.role == "Farmer" and "expiry_date" in attrs:
            attrs.pop("expiry_date", None)
        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["farmer"] = request.user
        product = Product.objects.create(**validated_data)
        TrackingRecord.objects.create(
            product=product,
            actor=request.user,
            role=request.user.role,
            location="Farm",
            temperature=product.temperature,
            humidity=product.humidity,
            status=TrackingRecord.Status.PRODUCED,
        )
        return product
