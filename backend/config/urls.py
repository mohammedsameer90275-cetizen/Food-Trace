from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from accounts.views import AuthProfileView, FarmerDetailViewSet, LoginView, SignupView, UserPreferenceView, UserViewSet
from dashboard.views import AdminDashboardView, DemoSeedView, FarmerDashboardView, ProjectShowcaseView
from inventory.views import InventoryViewSet
from notifications.views import NotificationViewSet
from products.views import ProductCatalogViewSet, ProductViewSet
from reports.views import ReportsView
from tracking.views import TrackingRecordViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")
router.register(r"farmers", FarmerDetailViewSet, basename="farmers")
router.register(r"catalog", ProductCatalogViewSet, basename="catalog")
router.register(r"products", ProductViewSet, basename="products")
router.register(r"tracking", TrackingRecordViewSet, basename="tracking")
router.register(r"notifications", NotificationViewSet, basename="notifications")
router.register(r"inventory", InventoryViewSet, basename="inventory")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/signup/", SignupView.as_view(), name="signup"),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/profile/", AuthProfileView.as_view(), name="profile"),
    path("api/users/me/", AuthProfileView.as_view(), name="users-me"),
    path("api/settings/me/", UserPreferenceView.as_view(), name="settings-me"),
    path("api/dashboard/farmer/", FarmerDashboardView.as_view(), name="farmer-dashboard"),
    path("api/dashboard/admin/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("api/demo/seed/", DemoSeedView.as_view(), name="demo-seed"),
    path("api/showcase/", ProjectShowcaseView.as_view(), name="project-showcase"),
    path("api/reports/summary/", ReportsView.as_view(), name="reports-summary"),
    path("api/", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
