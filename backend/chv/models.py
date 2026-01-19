"""
Models for Community Health Volunteer Management System
"""
from django.db import models
from django.core.validators import RegexValidator
from django.utils import timezone


# Kenyan Counties (all 47)
KENYAN_COUNTIES = [
    ('Baringo', 'Baringo'), ('Bomet', 'Bomet'), ('Bungoma', 'Bungoma'),
    ('Busia', 'Busia'), ('Elgeyo-Marakwet', 'Elgeyo-Marakwet'), ('Embu', 'Embu'),
    ('Garissa', 'Garissa'), ('Homa Bay', 'Homa Bay'), ('Isiolo', 'Isiolo'),
    ('Kajiado', 'Kajiado'), ('Kakamega', 'Kakamega'), ('Kericho', 'Kericho'),
    ('Kiambu', 'Kiambu'), ('Kilifi', 'Kilifi'), ('Kirinyaga', 'Kirinyaga'),
    ('Kisii', 'Kisii'), ('Kisumu', 'Kisumu'), ('Kitui', 'Kitui'),
    ('Kwale', 'Kwale'), ('Laikipia', 'Laikipia'), ('Lamu', 'Lamu'),
    ('Machakos', 'Machakos'), ('Makueni', 'Makueni'), ('Mandera', 'Mandera'),
    ('Marsabit', 'Marsabit'), ('Meru', 'Meru'), ('Migori', 'Migori'),
    ('Mombasa', 'Mombasa'), ("Murang'a", "Murang'a"), ('Nairobi', 'Nairobi'),
    ('Nakuru', 'Nakuru'), ('Nandi', 'Nandi'), ('Narok', 'Narok'),
    ('Nyamira', 'Nyamira'), ('Nyandarua', 'Nyandarua'), ('Nyeri', 'Nyeri'),
    ('Samburu', 'Samburu'), ('Siaya', 'Siaya'), ('Taita-Taveta', 'Taita-Taveta'),
    ('Tana River', 'Tana River'), ('Tharaka-Nithi', 'Tharaka-Nithi'),
    ('Trans Nzoia', 'Trans Nzoia'), ('Turkana', 'Turkana'),
    ('Uasin Gishu', 'Uasin Gishu'), ('Vihiga', 'Vihiga'), ('Wajir', 'Wajir'),
    ('West Pokot', 'West Pokot'),
]

# Phone number validator for Kenyan numbers
kenyan_phone_validator = RegexValidator(
    regex=r'^(\+254|254|0)?[17]\d{8}$',
    message="Enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)"
)

# National ID validator (8 digits)
national_id_validator = RegexValidator(
    regex=r'^\d{8}$',
    message="Kenyan National ID must be exactly 8 digits"
)


class TimestampedModel(models.Model):
    """Abstract base model with created_at and updated_at timestamps"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class CHV(TimestampedModel):
    """Community Health Volunteer"""
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, validators=[kenyan_phone_validator], unique=True)
    mpesa_number = models.CharField(max_length=20, validators=[kenyan_phone_validator], blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    county = models.CharField(max_length=50, choices=KENYAN_COUNTIES)
    sub_county = models.CharField(max_length=100)
    ward = models.CharField(max_length=100)
    service_area = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    date_trained = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Community Health Volunteer"
        verbose_name_plural = "Community Health Volunteers"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.county}"


class Facility(TimestampedModel):
    """Healthcare Facility"""
    FACILITY_TYPES = [
        ('Dispensary', 'Dispensary'),
        ('Health Centre', 'Health Centre'),
        ('Sub-County Hospital', 'Sub-County Hospital'),
        ('County Hospital', 'County Hospital'),
        ('National Referral Hospital', 'National Referral Hospital'),
        ('Private Hospital', 'Private Hospital'),
        ('Clinic', 'Clinic'),
    ]

    name = models.CharField(max_length=200)
    facility_type = models.CharField(max_length=50, choices=FACILITY_TYPES)
    county = models.CharField(max_length=50, choices=KENYAN_COUNTIES)
    sub_county = models.CharField(max_length=100)
    ward = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20, validators=[kenyan_phone_validator], blank=True, null=True)
    mpesa_paybill = models.CharField(max_length=20, blank=True, null=True)
    services = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Facilities"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.county}"


class Household(TimestampedModel):
    """Household"""
    head_name = models.CharField(max_length=200)
    contact_phone = models.CharField(max_length=20, validators=[kenyan_phone_validator])
    county = models.CharField(max_length=50, choices=KENYAN_COUNTIES)
    sub_county = models.CharField(max_length=100)
    ward = models.CharField(max_length=100)
    village = models.CharField(max_length=100)
    location_text = models.TextField(blank=True)
    gps_latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    gps_longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    assigned_chv = models.ForeignKey(CHV, on_delete=models.SET_NULL, null=True, blank=True, related_name='households')
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.head_name} - {self.county}"


class Member(TimestampedModel):
    """Community Member"""
    SEX_CHOICES = [('M', 'Male'), ('F', 'Female')]

    name = models.CharField(max_length=200)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    date_of_birth = models.DateField()
    national_id = models.CharField(max_length=8, validators=[national_id_validator], blank=True, null=True, unique=True)
    nhif_number = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=20, validators=[kenyan_phone_validator], blank=True, null=True)
    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name='members')
    is_pregnant = models.BooleanField(default=False)
    has_chronic_condition = models.BooleanField(default=False)
    chronic_conditions = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.household.head_name}"

    @property
    def age(self):
        return (timezone.now().date() - self.date_of_birth).days // 365


class Visit(TimestampedModel):
    """CHV Visit to Household"""
    CHANNEL_CHOICES = [
        ('app', 'Mobile App'),
        ('ussd', 'USSD'),
        ('whatsapp', 'WhatsApp'),
        ('sms', 'SMS'),
        ('voice', 'Voice Call'),
    ]

    chv = models.ForeignKey(CHV, on_delete=models.CASCADE, related_name='visits')
    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name='visits')
    member = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True, related_name='visits')
    visit_date = models.DateTimeField(default=timezone.now)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='app')
    purpose = models.CharField(max_length=200)
    observations = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(blank=True, null=True)

    class Meta:
        ordering = ['-visit_date']

    def __str__(self):
        return f"Visit by {self.chv.name} to {self.household.head_name} on {self.visit_date.date()}"


class Pregnancy(TimestampedModel):
    """Pregnancy Record"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('delivered', 'Delivered'),
        ('terminated', 'Terminated'),
        ('lost_to_followup', 'Lost to Follow-up'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='pregnancies')
    lmp_date = models.DateField(help_text="Last Menstrual Period date")
    edd = models.DateField(help_text="Expected Due Date")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    anc_visits = models.IntegerField(default=0)
    last_anc_date = models.DateField(blank=True, null=True)
    delivery_date = models.DateField(blank=True, null=True)
    delivery_outcome = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Pregnancies"
        ordering = ['-created_at']

    def __str__(self):
        return f"Pregnancy - {self.member.name} (EDD: {self.edd})"

    @property
    def gestational_age_weeks(self):
        if self.lmp_date:
            return (timezone.now().date() - self.lmp_date).days // 7
        return 0


class Referral(TimestampedModel):
    """Referral to Healthcare Facility"""
    PRIORITY_CHOICES = [
        ('routine', 'Routine'),
        ('urgent', 'Urgent'),
        ('emergency', 'Emergency'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='referrals')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='referrals')
    chv = models.ForeignKey(CHV, on_delete=models.SET_NULL, null=True, related_name='referrals')
    reason = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='routine')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    referral_date = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(blank=True, null=True)
    outcome = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-referral_date']

    def __str__(self):
        return f"Referral: {self.member.name} → {self.facility.name}"


class Reminder(TimestampedModel):
    """Reminder for Health Activities"""
    TYPE_CHOICES = [
        ('sms', 'SMS'),
        ('whatsapp', 'WhatsApp'),
        ('voice', 'Voice Call'),
    ]
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='reminders', null=True, blank=True)
    chv = models.ForeignKey(CHV, on_delete=models.SET_NULL, null=True, blank=True, related_name='reminders')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    template_code = models.CharField(max_length=100)
    schedule_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    sent_at = models.DateTimeField(blank=True, null=True)
    provider_message_id = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['schedule_at']

    def __str__(self):
        return f"Reminder: {self.template_code} - {self.status}"


class MessageLog(TimestampedModel):
    """Message Log for all communications"""
    CHANNEL_CHOICES = [
        ('ussd', 'USSD'),
        ('whatsapp', 'WhatsApp'),
        ('sms', 'SMS'),
        ('voice', 'Voice Call'),
    ]
    DIRECTION_CHOICES = [('in', 'Inbound'), ('out', 'Outbound')]

    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    direction = models.CharField(max_length=10, choices=DIRECTION_CHOICES)
    phone = models.CharField(max_length=20)
    content = models.TextField()
    payload = models.JSONField(default=dict, blank=True)
    correlation_id = models.CharField(max_length=200, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.channel} {self.direction} - {self.phone}"
