import re

from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import FarmerDetail, User, UserPreference


def validate_phone(value):
    if not re.fullmatch(r"[6-9]\d{9}", value or ""):
        raise serializers.ValidationError("Phone must be 10 digits and start with 6, 7, 8, or 9.")
    return value


def validate_password_strength(value):
    if not re.fullmatch(r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}", value or ""):
        raise serializers.ValidationError(
            "Password must be 8+ characters with uppercase, lowercase, number, and special character."
        )
    return value


class UserSerializer(serializers.ModelSerializer):
    active = serializers.BooleanField(source="is_active", required=False)

    class Meta:
        model = User
        fields = ["id", "fullname", "username", "email", "phone", "role", "active", "created_at"]
        read_only_fields = ["id", "created_at"]


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ["notify", "autoRefresh", "updated_at"]
        read_only_fields = ["updated_at"]


class FarmerDetailSerializer(serializers.ModelSerializer):
    created_by = serializers.IntegerField(source="created_by_id", read_only=True)

    class Meta:
        model = FarmerDetail
        fields = ["id", "name", "village", "phone", "product", "created_by", "created_at"]
        read_only_fields = ["id", "created_by", "created_at"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password_strength])
    confirmPassword = serializers.CharField(write_only=True, required=False)
    phone = serializers.CharField(validators=[validate_phone])

    class Meta:
        model = User
        fields = ["id", "fullname", "username", "email", "password", "confirmPassword", "phone", "role"]

    def validate(self, attrs):
        confirm_password = attrs.pop("confirmPassword", None)
        if confirm_password is not None and confirm_password != attrs.get("password"):
            raise serializers.ValidationError({"confirmPassword": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        role = validated_data.get("role")
        if role == User.Role.ADMIN:
            raise serializers.ValidationError({"role": "Admin users must be created by an existing admin."})
        return User.objects.create_user(**validated_data)


class AdminUserCreateSerializer(SignupSerializer):
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    loginType = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["username"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")
        if attrs.get("loginType") == "admin" and user.role != User.Role.ADMIN:
            raise serializers.ValidationError("Admin access required.")
        attrs["user"] = user
        return attrs

    def to_representation(self, instance):
        user = instance["user"]
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "token": str(refresh.access_token),
            "user": UserSerializer(user).data,
            "success": True,
            "message": "Login Successful",
        }
