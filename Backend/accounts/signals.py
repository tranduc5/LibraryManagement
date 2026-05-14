from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Sử dụng get_or_create để đảm bảo không bao giờ tạo trùng Profile
    """
    if created:
        # get_or_create trả về một tuple (object, created)
        # Chúng ta dùng nó để chắc chắn chỉ có 1 Profile cho 1 User
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    # Kiểm tra xem instance có profile không trước khi lưu để tránh lỗi AttributeError
    if hasattr(instance, 'profile'):
        instance.profile.save()