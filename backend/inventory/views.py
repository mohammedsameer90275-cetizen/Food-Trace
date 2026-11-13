from rest_framework import permissions, viewsets

from notifications.models import Notification
from .models import InventoryItem
from .serializers import InventorySerializer


class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    search_fields = ["product__product_id", "product__product_name"]
    ordering_fields = ["updated_at", "quantity"]

    def get_queryset(self):
        user = self.request.user
        qs = InventoryItem.objects.select_related("product", "retailer").all()
        if user.role == "Admin":
            return qs
        if user.role == "Retailer":
            return qs.filter(retailer=user)
        return qs.none()

    def perform_create(self, serializer):
        item = serializer.save(retailer=self.request.user)
        if item.quantity <= item.low_stock_threshold:
            Notification.objects.create(
                user=item.retailer,
                product=item.product,
                type=Notification.Type.LOW_STOCK,
                message=f"Low stock for {item.product.product_name}.",
            )

    def perform_update(self, serializer):
        item = serializer.save()
        if item.quantity <= item.low_stock_threshold:
            Notification.objects.get_or_create(
                user=item.retailer,
                product=item.product,
                type=Notification.Type.LOW_STOCK,
                defaults={"message": f"Low stock for {item.product.product_name}."},
            )
