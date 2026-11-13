from django.db.models.signals import post_save
from django.dispatch import receiver

from notifications.models import Notification
from tracking.models import TrackingRecord
from .models import Product


@receiver(post_save, sender=Product)
def create_product_notifications(sender, instance, **kwargs):
    if instance.status == Product.Status.WARNING:
        Notification.objects.get_or_create(
            user=instance.farmer,
            product=instance,
            type=Notification.Type.NEAR_EXPIRY,
            defaults={"message": f"{instance.product_name} is near expiry."},
        )
    if instance.status == Product.Status.EXPIRED:
        Notification.objects.get_or_create(
            user=instance.farmer,
            product=instance,
            type=Notification.Type.EXPIRED,
            defaults={"message": f"{instance.product_name} has expired."},
        )
