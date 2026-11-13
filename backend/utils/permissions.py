from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "Admin")


class RoleScopedPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.role == "Admin":
            return True
        if hasattr(obj, "farmer") and user.role == "Farmer":
            return obj.farmer_id == user.id
        if hasattr(obj, "assigned_distributor") and user.role == "Distributor":
            return obj.assigned_distributor_id == user.id
        if hasattr(obj, "assigned_retailer") and user.role == "Retailer":
            return obj.assigned_retailer_id == user.id
        return request.method in permissions.SAFE_METHODS
