"""
Admin configuration for CHV Management System
"""
from django.contrib import admin
from .models import (
    CHV, Household, Member, Facility, Visit, Pregnancy,
    Referral, Reminder, MessageLog
)


@admin.register(CHV)
class CHVAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'county', 'sub_county', 'is_active', 'created_at']
    list_filter = ['county', 'is_active', 'created_at']
    search_fields = ['name', 'phone', 'email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ['name', 'facility_type', 'county', 'is_active']
    list_filter = ['facility_type', 'county', 'is_active']
    search_fields = ['name', 'address']


@admin.register(Household)
class HouseholdAdmin(admin.ModelAdmin):
    list_display = ['head_name', 'contact_phone', 'county', 'ward', 'assigned_chv']
    list_filter = ['county', 'sub_county', 'ward']
    search_fields = ['head_name', 'contact_phone', 'location_text']


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'sex', 'date_of_birth', 'household', 'is_pregnant']
    list_filter = ['sex', 'is_pregnant', 'has_chronic_condition']
    search_fields = ['name', 'national_id', 'phone']


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = ['chv', 'household', 'visit_date', 'channel', 'purpose']
    list_filter = ['channel', 'visit_date', 'follow_up_required']
    date_hierarchy = 'visit_date'


@admin.register(Pregnancy)
class PregnancyAdmin(admin.ModelAdmin):
    list_display = ['member', 'lmp_date', 'edd', 'status', 'anc_visits']
    list_filter = ['status', 'lmp_date']
    date_hierarchy = 'lmp_date'


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ['member', 'facility', 'priority', 'status', 'referral_date']
    list_filter = ['priority', 'status', 'referral_date']
    date_hierarchy = 'referral_date'


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['template_code', 'type', 'status', 'schedule_at', 'member']
    list_filter = ['type', 'status', 'schedule_at']


@admin.register(MessageLog)
class MessageLogAdmin(admin.ModelAdmin):
    list_display = ['channel', 'direction', 'phone', 'timestamp']
    list_filter = ['channel', 'direction', 'timestamp']
    date_hierarchy = 'timestamp'
    readonly_fields = ['timestamp', 'created_at', 'updated_at']
