from datetime import timedelta

from django.utils import timezone

from accounts.models import User
from inventory.models import InventoryItem
from notifications.models import Notification
from products.models import Product, ProductCatalog
from tracking.models import TrackingRecord


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


DEMO_ACCOUNTS = [
    ("demo_admin", "Admin", "FoodTrace Demo Admin", "demo.admin@foodtrace.local", "9876500000"),
    ("demo_farmer", "Farmer", "Asha Green Farms", "farmer@foodtrace.local", "9876500001"),
    ("demo_distributor", "Distributor", "SwiftCold Logistics", "distributor@foodtrace.local", "9876500002"),
    ("demo_retailer", "Retailer", "FreshMart Retail Hub", "retailer@foodtrace.local", "9876500003"),
    ("demo_consumer", "Consumer", "Consumer Demo User", "consumer@foodtrace.local", "9876500004"),
]


def ensure_demo_accounts():
    users = {}
    for username, role, fullname, email, phone in DEMO_ACCOUNTS:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "fullname": fullname,
                "email": email,
                "phone": phone,
                "role": role,
                "is_staff": role == "Admin",
                "is_superuser": role == "Admin",
            },
        )
        if created:
            user.set_password("Demo@123")
            user.save()
        users[role] = user
    return users


def ensure_catalog():
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


def create_tracking(product, actor, role, status, location, temperature, humidity, days_ago):
    record, _ = TrackingRecord.objects.get_or_create(
        product=product,
        status=status,
        location=location,
        defaults={
            "actor": actor,
            "role": role,
            "temperature": temperature,
            "humidity": humidity,
        },
    )
    TrackingRecord.objects.filter(pk=record.pk).update(
        timestamp=timezone.now() - timedelta(days=days_ago)
    )
    return record


def seed_premium_demo():
    ensure_catalog()
    users = ensure_demo_accounts()
    farmer = users["Farmer"]
    distributor = users["Distributor"]
    retailer = users["Retailer"]

    demo_specs = [
        ("Tomato", "Vegetable", 120, "Kg", 2, "Cold Storage", 7, 88, "Aisle 4 Cold Bay", False),
        ("Mango", "Fruit", 80, "Kg", 8, "Cool Room", 13, 82, "Ripening Chamber", False),
        ("Spinach", "Vegetable", 35, "Kg", 5, "Cold Storage", 2, 95, "Retail Chiller 2", False),
        ("Banana", "Fruit", 60, "Kg", 9, "Room", 24, 78, "Retail Front Shelf", True),
        ("Grapes", "Fruit", 45, "Kg", 1, "Cold Storage", 1, 94, "Premium Fruit Rack", False),
        ("Potato", "Vegetable", 150, "Kg", 20, "Dry Storage", 19, 61, "Dry Goods Bin", False),
    ]

    created_products = []
    for name, category, quantity, unit, harvest_days_ago, storage, temp, humidity, retail_location, damaged in demo_specs:
        product, _ = Product.objects.update_or_create(
            farmer=farmer,
            product_name=name,
            harvest_date=timezone.localdate() - timedelta(days=harvest_days_ago),
            defaults={
                "category": category,
                "quantity": quantity,
                "unit": unit,
                "storage_type": storage,
                "temperature": temp,
                "humidity": humidity,
                "assigned_distributor": distributor,
                "assigned_retailer": retailer,
            },
        )
        created_products.append(product)

        create_tracking(product, farmer, "Farmer", TrackingRecord.Status.PRODUCED, "Asha Green Farms", temp, humidity, harvest_days_ago)
        create_tracking(product, distributor, "Distributor", TrackingRecord.Status.COLLECTED, "Farm Gate Collection", temp + 1, humidity - 2, max(harvest_days_ago - 1, 0))
        create_tracking(product, distributor, "Distributor", TrackingRecord.Status.IN_TRANSIT, "NH-48 Cold Chain Route", temp + (9 if name == "Banana" else 2), humidity - 5, max(harvest_days_ago - 2, 0))
        create_tracking(product, retailer, "Retailer", TrackingRecord.Status.DELIVERED, retail_location, temp + 1, humidity - 3, max(harvest_days_ago - 3, 0))
        create_tracking(product, retailer, "Retailer", TrackingRecord.Status.DAMAGED if damaged else TrackingRecord.Status.IN_STOCK, retail_location, temp + 1, humidity - 4, 0)

        item, _ = InventoryItem.objects.update_or_create(
            product=product,
            retailer=retailer,
            defaults={
                "quantity": 3 if name in {"Spinach", "Grapes"} else quantity / 2,
                "low_stock_threshold": 5,
                "is_sold": name == "Mango",
                "is_damaged": damaged,
            },
        )

        if product.status == Product.Status.WARNING:
            Notification.objects.get_or_create(
                user=farmer,
                product=product,
                type=Notification.Type.NEAR_EXPIRY,
                defaults={"message": f"{product.product_name} is near expiry. Dispatch or discount soon."},
            )
        if product.status == Product.Status.EXPIRED:
            Notification.objects.get_or_create(
                user=farmer,
                product=product,
                type=Notification.Type.EXPIRED,
                defaults={"message": f"{product.product_name} has expired and must be removed."},
            )
        if temp > 20 or name == "Banana":
            Notification.objects.get_or_create(
                user=distributor,
                product=product,
                type=Notification.Type.TEMPERATURE_BREACH,
                defaults={"message": f"Temperature breach detected for {product.product_name} during transit."},
            )
        if item.quantity <= item.low_stock_threshold:
            Notification.objects.get_or_create(
                user=retailer,
                product=product,
                type=Notification.Type.LOW_STOCK,
                defaults={"message": f"Low stock for {product.product_name} at FreshMart."},
            )

    return {
        "accounts": len(DEMO_ACCOUNTS),
        "products": len(created_products),
        "tracking_records": TrackingRecord.objects.filter(product__in=created_products).count(),
        "notifications": Notification.objects.count(),
        "inventory": InventoryItem.objects.filter(product__in=created_products).count(),
    }
