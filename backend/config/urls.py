"""
URL configuration for CHV Management System
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from chv.views import (
    CHVViewSet,
    HouseholdViewSet,
    MemberViewSet,
    FacilityViewSet,
    VisitViewSet,
    PregnancyViewSet,
    ReferralViewSet,
    ReminderViewSet,
    MessageLogViewSet,
    register_user,
)

router = DefaultRouter()
router.register(r'chvs', CHVViewSet, basename='chv')
router.register(r'households', HouseholdViewSet, basename='household')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'facilities', FacilityViewSet, basename='facility')
router.register(r'visits', VisitViewSet, basename='visit')
router.register(r'pregnancies', PregnancyViewSet, basename='pregnancy')
router.register(r'referrals', ReferralViewSet, basename='referral')
router.register(r'reminders', ReminderViewSet, basename='reminder')
router.register(r'message-logs', MessageLogViewSet, basename='messagelog')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', register_user, name='register'),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]
