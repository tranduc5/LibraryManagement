from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

# Hiển thị Profile ngay trong trang User
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Thông tin độc giả'

# Định nghĩa lại trang quản lý User
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'get_role', 'is_staff')

    def get_role(self, obj):
        return obj.profile.role
    get_role.short_description = 'Vai trò'

# Re-register User
admin.site.unregister(User)
admin.site.register(User, UserAdmin)