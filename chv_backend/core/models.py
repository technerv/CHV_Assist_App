from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CHV(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=32, unique=True)
    area = models.CharField(max_length=120, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Facility(models.Model):
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=80, blank=True)
    services = models.JSONField(default=list, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    address = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Household(models.Model):
    head_name = models.CharField(max_length=120)
    contact_phone = models.CharField(max_length=32, blank=True)
    location_text = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Member(models.Model):
    SEX_CHOICES = (
        ("M", "M"),
        ("F", "F"),
        ("O", "O"),
    )
    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name="members")
    name = models.CharField(max_length=120)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    dob = models.DateField(null=True, blank=True)
    national_id = models.CharField(max_length=32, blank=True)
    chronic_conditions = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Visit(models.Model):
    CHANNEL_CHOICES = (
        ("app", "app"),
        ("ussd", "ussd"),
        ("whatsapp", "whatsapp"),
    )
    chv = models.ForeignKey(CHV, on_delete=models.CASCADE, related_name="visits")
    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name="visits")
    member = models.ForeignKey(Member, null=True, blank=True, on_delete=models.SET_NULL, related_name="visits")
    visit_date = models.DateField()
    channel = models.CharField(max_length=16, choices=CHANNEL_CHOICES, default="app")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SymptomReport(models.Model):
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE, related_name="symptom_reports")
    symptom_codes = models.JSONField(default=list, blank=True)
    severity = models.IntegerField(default=0)
    flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Pregnancy(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="pregnancies")
    gestational_age_weeks = models.IntegerField(default=0)
    due_date = models.DateField(null=True, blank=True)
    risk_flags = models.JSONField(default=list, blank=True)
    last_anc_visit = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Referral(models.Model):
    PRIORITY_CHOICES = (
        ("normal", "normal"),
        ("urgent", "urgent"),
    )
    STATUS_CHOICES = (
        ("pending", "pending"),
        ("completed", "completed"),
        ("cancelled", "cancelled"),
    )
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="referrals")
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="referrals")
    reason = models.TextField()
    priority = models.CharField(max_length=16, choices=PRIORITY_CHOICES, default="normal")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class Reminder(models.Model):
    TYPE_CHOICES = (
        ("sms", "sms"),
        ("voice", "voice"),
        ("wa", "wa"),
    )
    STATUS_CHOICES = (
        ("scheduled", "scheduled"),
        ("sent", "sent"),
        ("failed", "failed"),
    )
    member = models.ForeignKey(Member, null=True, blank=True, on_delete=models.SET_NULL, related_name="reminders")
    chv = models.ForeignKey(CHV, null=True, blank=True, on_delete=models.SET_NULL, related_name="reminders")
    type = models.CharField(max_length=8, choices=TYPE_CHOICES)
    schedule_at = models.DateTimeField()
    template_code = models.CharField(max_length=64)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="scheduled")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    provider_message_id = models.CharField(max_length=64, blank=True)

class MessageLog(models.Model):
    CHANNEL_CHOICES = (
        ("ussd", "ussd"),
        ("whatsapp", "whatsapp"),
        ("sms", "sms"),
        ("voice", "voice"),
        ("app", "app"),
    )
    DIRECTION_CHOICES = (
        ("in", "in"),
        ("out", "out"),
    )
    channel = models.CharField(max_length=16, choices=CHANNEL_CHOICES)
    direction = models.CharField(max_length=3, choices=DIRECTION_CHOICES)
    phone = models.CharField(max_length=32, blank=True)
    content = models.TextField(blank=True)
    payload = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    correlation_id = models.CharField(max_length=64, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class Rule(models.Model):
    SCOPE_CHOICES = (
        ("visit", "visit"),
        ("pregnancy", "pregnancy"),
        ("referral", "referral"),
    )
    name = models.CharField(max_length=120)
    scope = models.CharField(max_length=16, choices=SCOPE_CHOICES)
    condition_json = models.JSONField(default=dict)
    actions_json = models.JSONField(default=list)
    enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

class SyncEnvelope(models.Model):
    device_id = models.CharField(max_length=64)
    payload = models.JSONField(default=dict)
    applied_at = models.DateTimeField(null=True, blank=True)
    conflict_status = models.CharField(max_length=32, default="none")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
