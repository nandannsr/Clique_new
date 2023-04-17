from rest_framework.permissions import BasePermission


""" To check whether the user is superuser in Admin Views """
class IsSuperuser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser
