from django.db.models import Count
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from inventory.models import InventoryItem
from notifications.models import Notification
from products.models import Product
from products.serializers import ProductSerializer
from tracking.models import TrackingRecord
from tracking.serializers import TrackingRecordSerializer
from utils.permissions import IsAdmin
from .demo import DEMO_ACCOUNTS, seed_premium_demo


def product_stats(qs):
    return {
        "totalProducts": qs.count(),
        "freshProducts": qs.filter(status="Fresh").count(),
        "warningProducts": qs.filter(status="Warning").count(),
        "expiredProducts": qs.filter(status="Expired").count(),
    }


class FarmerDashboardView(APIView):
    def get(self, request):
        qs = Product.objects.filter(farmer=request.user)
        return Response({
            "success": True,
            "summary": product_stats(qs),
            "recentProducts": ProductSerializer(qs[:5], many=True, context={"request": request}).data,
        })


class AdminDashboardView(APIView):
    def get(self, request):
        products = Product.objects.all()
        role_counts = {row["role"]: row["total"] for row in User.objects.values("role").annotate(total=Count("id"))}
        return Response({
            "success": True,
            "statistics": {
                "totalUsers": User.objects.count(),
                "farmers": role_counts.get("Farmer", 0),
                "distributors": role_counts.get("Distributor", 0),
                "retailers": role_counts.get("Retailer", 0),
                "consumers": role_counts.get("Consumer", 0),
                **product_stats(products),
            },
            "latestProducts": ProductSerializer(products[:5], many=True, context={"request": request}).data,
            "latestUsers": [
                {"id": u.id, "fullname": u.fullname, "username": u.username, "role": u.role}
                for u in User.objects.order_by("-created_at")[:5]
            ],
            "latestTracking": TrackingRecordSerializer(TrackingRecord.objects.order_by("-timestamp")[:5], many=True).data,
        })


class DemoSeedView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        result = seed_premium_demo()
        return Response({
            "success": True,
            "message": "Premium FoodTrace demo data is ready.",
            "result": result,
        })


class ProjectShowcaseView(APIView):
    def get(self, request):
        products = Product.objects.all()
        status_counts = {row["status"]: row["total"] for row in products.values("status").annotate(total=Count("id"))}
        category_counts = list(products.values("category").annotate(total=Count("id")).order_by("category"))
        tracking_by_status = list(TrackingRecord.objects.values("status").annotate(total=Count("id")).order_by("status"))
        alerts = Notification.objects.select_related("product", "user")[:8]

        return Response({
            "project": {
                "title": "FoodTrace - AI Powered Food Supply Chain Traceability & Safety Monitoring System",
                "stack": ["React 19", "Django REST Framework", "SQLite", "JWT Auth", "QR Traceability"],
                "cloudReady": ["PostgreSQL-ready models", "Environment-based API origin", "Media folder isolated", "JWT auth", "Deployable frontend/backend split"],
                "examinerHighlights": [
                    "Custom role-based authentication",
                    "Automatic product and batch IDs",
                    "Automatic freshness score and status",
                    "End-to-end tracking timeline",
                    "Notifications for expiry, temperature, shipment, and stock risk",
                    "QR safety certificate for consumers",
                ],
            },
            "demoAccounts": [
                {"username": username, "password": "Demo@123", "role": role, "fullname": fullname}
                for username, role, fullname, _email, _phone in DEMO_ACCOUNTS
            ],
            "stats": {
                "users": User.objects.count(),
                "products": products.count(),
                "fresh": status_counts.get("Fresh", 0),
                "warning": status_counts.get("Warning", 0),
                "expired": status_counts.get("Expired", 0),
                "tracking": TrackingRecord.objects.count(),
                "notifications": Notification.objects.count(),
                "inventory": InventoryItem.objects.count(),
            },
            "charts": {
                "status": [
                    {"name": "Fresh", "value": status_counts.get("Fresh", 0)},
                    {"name": "Warning", "value": status_counts.get("Warning", 0)},
                    {"name": "Expired", "value": status_counts.get("Expired", 0)},
                ],
                "categories": [{"name": row["category"], "value": row["total"]} for row in category_counts],
                "tracking": [{"name": row["status"], "value": row["total"]} for row in tracking_by_status],
            },
            "recentActivities": [
                {
                    "type": "Tracking",
                    "title": f"{record.product.product_id} - {record.status}",
                    "meta": f"{record.role} at {record.location or 'Unknown location'}",
                    "timestamp": record.timestamp,
                }
                for record in TrackingRecord.objects.select_related("product").order_by("-timestamp")[:8]
            ],
            "alerts": [
                {
                    "type": alert.type,
                    "message": alert.message,
                    "product_id": alert.product.product_id if alert.product else "",
                    "created_at": alert.created_at,
                }
                for alert in alerts
            ],
        })
