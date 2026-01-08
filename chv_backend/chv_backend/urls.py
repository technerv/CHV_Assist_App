"""
URL configuration for chv_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import (
    CHVViewSet,
    FacilityViewSet,
    HouseholdViewSet,
    MemberViewSet,
    VisitViewSet,
    SymptomReportViewSet,
    PregnancyViewSet,
    ReferralViewSet,
    ReminderViewSet,
    MessageLogViewSet,
    RuleViewSet,
    USSDWebhook,
    WhatsAppWebhook,
    SyncApply,
    SyncChanges,
    SMSDLR,
    WhatsAppDLR,
    SupervisorSummary,
)

router = DefaultRouter()
router.register(r'chvs', CHVViewSet)
router.register(r'facilities', FacilityViewSet)
router.register(r'households', HouseholdViewSet)
router.register(r'members', MemberViewSet)
router.register(r'visits', VisitViewSet)
router.register(r'symptom-reports', SymptomReportViewSet)
router.register(r'pregnancies', PregnancyViewSet)
router.register(r'referrals', ReferralViewSet)
router.register(r'reminders', ReminderViewSet)
router.register(r'message-logs', MessageLogViewSet)
router.register(r'rules', RuleViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/channels/ussd/webhook', USSDWebhook.as_view(), name='ussd_webhook'),
    path('api/channels/whatsapp/webhook', WhatsAppWebhook.as_view(), name='wa_webhook'),
    path('api/channels/sms/dlr', SMSDLR.as_view(), name='sms_dlr'),
    path('api/channels/whatsapp/dlr', WhatsAppDLR.as_view(), name='wa_dlr'),
    path('api/sync/apply', SyncApply.as_view(), name='sync_apply'),
    path('api/sync/changes', SyncChanges.as_view(), name='sync_changes'),
    path('api/supervisor/summary', SupervisorSummary.as_view(), name='supervisor_summary'),
]
