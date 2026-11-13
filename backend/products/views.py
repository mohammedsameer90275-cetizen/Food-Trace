from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from utils.permissions import IsAdmin, RoleScopedPermission
from .models import Product, ProductCatalog
from .serializers import ProductCatalogSerializer, ProductSerializer


class ProductCatalogViewSet(viewsets.ModelViewSet):
    queryset = ProductCatalog.objects.filter(is_active=True)
    serializer_class = ProductCatalogSerializer
    search_fields = ["name", "category"]
    ordering_fields = ["name", "category", "shelf_life_days"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [IsAdmin()]


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [RoleScopedPermission]
    search_fields = ["product_id", "batch_id", "product_name", "category", "farmer__fullname"]
    ordering_fields = ["created_at", "expiry_date", "freshness_score", "status"]

    def get_queryset(self):
        user = self.request.user
        qs = Product.objects.select_related("farmer", "assigned_distributor", "assigned_retailer").all()
        if not user.is_authenticated:
            return qs.none()
        if user.role == "Admin":
            return qs
        if user.role == "Farmer":
            return qs.filter(farmer=user)
        if user.role == "Distributor":
            return qs.filter(Q(assigned_distributor=user) | Q(assigned_distributor__isnull=True))
        if user.role == "Retailer":
            return qs.filter(Q(assigned_retailer=user) | Q(inventory_items__retailer=user)).distinct()
        return qs

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup = self.kwargs.get(self.lookup_url_kwarg or self.lookup_field)
        query = Q(product_id=lookup)
        if str(lookup).isdigit():
            query |= Q(pk=lookup)
        obj = get_object_or_404(queryset, query)
        self.check_object_permissions(self.request, obj)
        return obj

    def get_permissions(self):
        if self.action in ["list", "retrieve", "search"]:
            return [permissions.IsAuthenticated()]
        if self.request.user.is_authenticated and self.request.user.role == "Consumer":
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated(), RoleScopedPermission()]

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        term = request.query_params.get("q", "").strip()
        qs = self.get_queryset().filter(
            Q(product_id__iexact=term)
            | Q(product_id__icontains=term)
            | Q(product_name__icontains=term)
            | Q(batch_id__icontains=term)
        )
        return Response(ProductSerializer(qs, many=True, context={"request": request}).data)

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        product = self.get_object()
        status_value = request.data.get("stage") or request.data.get("status") or "In Transit"
        location = request.data.get("location", "")
        temperature = request.data.get("temperature") or product.temperature
        humidity = request.data.get("humidity") or product.humidity
        record = product.tracking_records.create(
            actor=request.user,
            role=request.user.role,
            location=location,
            temperature=temperature,
            humidity=humidity,
            status=status_value,
        )
        return Response({"success": True, "tracking_id": record.id, "product": ProductSerializer(product, context={"request": request}).data})
