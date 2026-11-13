from rest_framework import permissions, viewsets

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    search_fields = ["type", "message", "product__product_id"]
    ordering_fields = ["created_at", "type"]

    def get_queryset(self):
        user = self.request.user
        qs = Notification.objects.select_related("user", "product").all()
        if user.role == "Admin":
            return qs
        return qs.filter(user=user) | qs.filter(user__isnull=True)

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        if self.request.user.role == "Admin":
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
