from rest_framework import permissions, viewsets

from products.models import Product
from .models import TrackingRecord
from .serializers import TrackingRecordSerializer


class TrackingRecordViewSet(viewsets.ModelViewSet):
    serializer_class = TrackingRecordSerializer
    search_fields = ["product__product_id", "product__product_name", "location", "status"]
    ordering_fields = ["timestamp", "status"]

    def get_queryset(self):
        user = self.request.user
        qs = TrackingRecord.objects.select_related("product", "actor").all()
        if user.role == "Admin" or user.role == "Consumer":
            return qs
        if user.role == "Farmer":
            return qs.filter(product__farmer=user)
        if user.role == "Distributor":
            return qs.filter(product__assigned_distributor=user)
        if user.role == "Retailer":
            return qs.filter(product__assigned_retailer=user)
        return qs.none()

    def perform_create(self, serializer):
        serializer.save(actor=self.request.user, role=self.request.user.role)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        if self.request.user.role == "Consumer":
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]
