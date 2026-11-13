from django.core.management.base import BaseCommand

from accounts.models import User
from dashboard.demo import ensure_demo_accounts
from products.models import ProductCatalog


DATASET = [
    ("Tomato", "Vegetable", 7, "Cold Storage", 8, 90),
    ("Potato", "Vegetable", 60, "Dry Storage", 18, 65),
    ("Onion", "Vegetable", 45, "Dry Storage", 18, 60),
    ("Carrot", "Vegetable", 21, "Cold Storage", 4, 95),
    ("Cabbage", "Vegetable", 30, "Cold Storage", 2, 95),
    ("Cauliflower", "Vegetable", 14, "Cold Storage", 2, 95),
    ("Brinjal", "Vegetable", 7, "Cool Room", 12, 90),
    ("Spinach", "Vegetable", 5, "Cold Storage", 2, 95),
    ("Cucumber", "Vegetable", 10, "Cold Storage", 8, 90),
    ("Capsicum", "Vegetable", 14, "Cold Storage", 7, 90),
    ("Apple", "Fruit", 90, "Cold Storage", 2, 90),
    ("Banana", "Fruit", 7, "Room", 18, 85),
    ("Mango", "Fruit", 10, "Room", 13, 85),
    ("Grapes", "Fruit", 21, "Cold Storage", 0, 95),
    ("Orange", "Fruit", 45, "Cold Storage", 5, 90),
    ("Lemon", "Fruit", 30, "Cold Storage", 8, 90),
    ("Guava", "Fruit", 8, "Cool Room", 10, 85),
    ("Papaya", "Fruit", 7, "Room", 12, 85),
    ("Pomegranate", "Fruit", 60, "Cold Storage", 5, 90),
    ("Pineapple", "Fruit", 14, "Cold Storage", 8, 90),
]


class Command(BaseCommand):
    help = "Seed FoodTrace catalog and default admin account."

    def handle(self, *args, **options):
        for name, category, shelf_life_days, storage, temperature, humidity in DATASET:
            ProductCatalog.objects.update_or_create(
                name=name,
                defaults={
                    "category": category,
                    "shelf_life_days": shelf_life_days,
                    "default_storage_type": storage,
                    "ideal_temperature": temperature,
                    "ideal_humidity": humidity,
                    "is_active": True,
                },
            )

        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin",
                password="Admin@123",
                email="admin@foodtrace.local",
                fullname="FoodTrace Admin",
                phone="9876543210",
                role=User.Role.ADMIN,
            )

        ensure_demo_accounts()

        self.stdout.write(self.style.SUCCESS("Seeded 20 catalog items, default admin, and role demo accounts."))
