from django.db.models import Count
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from utils.permissions import IsAdmin
from .models import FarmerDetail, User, UserPreference
from .serializers import AdminUserCreateSerializer, FarmerDetailSerializer, LoginSerializer, SignupSerializer, UserPreferenceSerializer, UserSerializer


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"success": True, "message": "Account created successfully.", "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.to_representation(serializer.validated_data))


class AuthProfileView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserPreferenceView(APIView):
    def get(self, request):
        preference, _ = UserPreference.objects.get_or_create(user=request.user)
        return Response(UserPreferenceSerializer(preference).data)

    def put(self, request):
        preference, _ = UserPreference.objects.get_or_create(user=request.user)
        serializer = UserPreferenceSerializer(preference, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-created_at")
    permission_classes = [IsAdmin]
    search_fields = ["fullname", "username", "email", "phone", "role"]
    ordering_fields = ["created_at", "fullname", "role"]

    def get_serializer_class(self):
        if self.action == "create":
            return AdminUserCreateSerializer
        return UserSerializer

    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()
        if "active" in request.data:
            user.is_active = bool(request.data["active"])
            user.save(update_fields=["is_active"])
            return Response(UserSerializer(user).data)
        if "newPassword" in request.data:
            user.set_password(request.data["newPassword"])
            user.save(update_fields=["password"])
            return Response({"success": True, "message": "Password reset successfully."})
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=["patch"], url_path="status")
    def status(self, request, pk=None):
        user = self.get_object()
        user.is_active = bool(request.data.get("active", True))
        user.save(update_fields=["is_active"])
        return Response(UserSerializer(user).data)

    @action(detail=True, methods=["patch"], url_path="reset-password")
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get("newPassword")
        if not new_password:
            return Response({"message": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({"success": True, "message": "Password reset successfully."})


def user_role_counts():
    counts = User.objects.values("role").annotate(total=Count("id"))
    return {row["role"]: row["total"] for row in counts}


class FarmerDetailViewSet(viewsets.ModelViewSet):
    serializer_class = FarmerDetailSerializer
    search_fields = ["name", "village", "phone", "product"]
    ordering_fields = ["created_at", "name", "village"]

    def get_queryset(self):
        if self.request.user.role == "Admin":
            return FarmerDetail.objects.all()
        return FarmerDetail.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
