from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import FarmerDetail, User, UserPreference


@admin.register(User)
class FoodTraceUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("FoodTrace", {"fields": ("fullname", "phone", "role")}),
    )
    list_display = ("username", "fullname", "email", "phone", "role", "is_active", "created_at")
    list_filter = ("role", "is_active")


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "notify", "autoRefresh", "updated_at")


@admin.register(FarmerDetail)
class FarmerDetailAdmin(admin.ModelAdmin):
    list_display = ("name", "village", "phone", "product", "created_by", "created_at")
    search_fields = ("name", "village", "phone", "product")
